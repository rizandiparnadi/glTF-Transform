import { Extension, Node, ReaderContext, WriterContext, type vec3, type vec4, } from '@gltf-transform/core';
import { KHR_PHYSICS_RIGID_BODIES } from '../constants.js';
import { KHRImplicitShapes } from '../khr-implicit-shapes/implicit-shapes.js';
import { Collider } from './collider.js';
import { Geometry } from './geometry.js';
import { Motion } from './motion.js';
import { PhysicsMaterial, type PhysicalPropertyCombineType } from './physics-material.js';
import { RigidBody } from './rigid-body.js';
import { Sphere, Box, Capsule, Cylinder } from '../khr-implicit-shapes/index.js';

const NAME = KHR_PHYSICS_RIGID_BODIES;

interface MotionDef {
    isKinematic?: boolean;
    mass?: number;
    centerOfMass?: vec3;
    inertiaOrientation?: vec4;
    inertiaDiagonal?: vec3;
    linearVelocity?: vec3;
    angularVelocity?: vec3;
    gravityFactor?: number;
}

interface GeometryDef {
    shape?: number;  // Indexes top-level KHR_implicit_shapes.shape
    node?: number;  // Indexes a glTF node which provides a mesh representation of the geometry.
    convexHull: boolean;
}

interface ColliderDef {
    geometry: GeometryDef;
    physicsMaterial: number;  // Indexes into the top-level KHRPhysicsRigidBodies.physicsMaterials.
    collisionFilter: number;  // Indexes into the top-level KHRPhysicsRigidBodies.collisionFilters.
}

interface RigidBodyDef {
    motion?: MotionDef;
    collider?: ColliderDef;
}

interface PhysicsMaterialDef {
    staticFriction: number;
    dynamicFriction: number;
    restitution: number;
    restitutionCombine: PhysicalPropertyCombineType;
    frictionCombine: PhysicalPropertyCombineType;
}

// Top level sets of reusable objects.
interface PhysicsRigidBodiesRootDef {
    physicsMaterials: PhysicsMaterialDef[];
    collisionFilters: any;
}

/**
 * [`KHR_physics_rigid_bodies`](https://github.com/eoineoineoin/glTF_Physics/tree/master/extensions/2.0/Khronos/KHR_physics_rigid_bodies)
 * 
 * This extension defines a set of properties which may be added to glTF nodes, making them suitable for rigid body dynamics simulation. Such a simulation may update node transforms, effectively animating node transforms procedurally in a physically plausible manner.
 * 
 * Properties:
 * - {@link RigidBody} - The main rigid body property attached to a node. May contain one or more of the following properties: Motion, Collider, Trigger, Joint.
 * - {@link Motion} - Allows the simulation to move this node, describing parameters for that motion.
 * - {@link Collider} - Describes the physical representation of a node's shape for collision detection.
 * - {@link PhysicsMaterial} - escribes how the collider should respond to collisions.
 * 
 * TODO: Joints, Constrains the motion of this node relative to another.
 * TODO: Collision filters, which allow for control over which pairs of nodes should collide.
 * TODO: Triggers, Describes a volume which can detect collisions, but does not generate a physical response.
 */
export class KHRPhysicsRigidBodies extends Extension {
    public static readonly EXTENSION_NAME = NAME;
    public readonly extensionName = NAME;

    /**
     * // TODO: Store these.
     * physicsMaterials?: Array<PhysicsMaterial>;
     * physicsJoints?: Array<JointDescription>;
     * collisionFilters?: Array<CollisionFilter>;
     */

    public createRigidBody(): RigidBody {
        return new RigidBody(this.document.getGraph());
    }

    public createMotion(): Motion {
        return new Motion(this.document.getGraph());
    }

    public createCollider(): Collider {
        return new Collider(this.document.getGraph());
    }

    public createGeometry(): Geometry {
        return new Geometry(this.document.getGraph());
    }

    public createPhysicsMaterial(): PhysicsMaterial {
        return new PhysicsMaterial(this.document.getGraph());
    }

    public read(context: ReaderContext): this {
        const jsonDoc = context.jsonDoc;

		if (!jsonDoc.json.extensions || !jsonDoc.json.extensions[NAME]) return this;

        // Top-level.
        const extensionRoot = jsonDoc.json.extensions[NAME] as PhysicsRigidBodiesRootDef;

        // This extension depends on the KHR_implicit_shapes extension.
        const implicitShapesExtension = this.document.createExtension(KHRImplicitShapes);

        /** Turn the glTF-side JSON PhysicsMaterialDef into the TS-side PhysicsMaterial. */
        const physicsMaterials = extensionRoot.physicsMaterials.map((physicsMaterialDef) => {
            return this.createPhysicsMaterial()
                .setStaticFriction(physicsMaterialDef.staticFriction)
                .setDynamicFriction(physicsMaterialDef.dynamicFriction)
                .setRestitution(physicsMaterialDef.restitution)
                .setRestitutionCombine(physicsMaterialDef.restitutionCombine)
                .setFrictionCombine(physicsMaterialDef.frictionCombine);
        });
    
        jsonDoc.json.nodes!.forEach((nodeDef, nodeIndex) => {
			if (!nodeDef.extensions || !nodeDef.extensions[NAME]) return;
			const rigidBodyNodeDef = nodeDef.extensions[NAME] as RigidBodyDef;

            /** Convert the glTF-side JSON MotionDef object to TS-side Motion object. */
            const motionDef = rigidBodyNodeDef.motion;
            let motion: Motion | null = null;
            if (motionDef) {
                motion = this.createMotion();
                if (motionDef.isKinematic !== undefined) motion.setIsKinematic(motionDef.isKinematic);
                if (motionDef.mass !== undefined) motion.setMass(motionDef.mass);
                if (motionDef.centerOfMass !== undefined) motion.setCenterOfMass(motionDef.centerOfMass);
                if (motionDef.inertiaOrientation !== undefined) motion.setInertiaOrientation(motionDef.inertiaOrientation);
                if (motionDef.inertiaDiagonal !== undefined) motion.setInertiaDiagonal(motionDef.inertiaDiagonal);
                if (motionDef.linearVelocity !== undefined) motion.setLinearVelocity(motionDef.linearVelocity);
                if (motionDef.angularVelocity !== undefined) motion.setAngularVelocity(motionDef.angularVelocity);
                if (motionDef.gravityFactor !== undefined) motion.setGravityFactor(motionDef.gravityFactor);
            }

            /** Convert the glTF-side JSON ColliderDef object to TS-side Collider object. */
            const colliderDef = rigidBodyNodeDef.collider;
            let collider: Collider | null = null;
            if (colliderDef) {
                collider = this.createCollider();

                // Get PhysicsMaterial from index.
                collider.setPhysicsMaterial(physicsMaterials[colliderDef.physicsMaterial]) 
                // TODO: Get CollisionFilter from index.
                // .setCollisionFilter(colliderDef.collisionFilter)

                // Get shape from index
                // TODO: Handle case when geometry.node instead of geometry.shape is used.
                const geometryDef = colliderDef.geometry;
                const shapeIndex = geometryDef.shape;
                const nodeIndex = geometryDef.node;
                let geometry: Geometry | null = null;
                let shape: Sphere | Box | Capsule | Cylinder | null = null;
                let node: Node | null = null;
    
                if (shapeIndex !== undefined) shape = implicitShapesExtension.getShape(shapeIndex);
                else if (nodeIndex !== undefined) node = context.nodes[nodeIndex];

                geometry = this.createGeometry().setShape(shape ?? node);
                if (geometry) collider.setGeometry(geometry);
            }

            if (motion || collider) {
                const rigidBody = this.createRigidBody();
                if (motion) rigidBody.setMotion(motion);
                if (collider) rigidBody.setCollider(collider);

                context.nodes[nodeIndex].setExtension(NAME, rigidBody);
            }
        });

        return this;
    }

    public write(context: WriterContext): this {
        // TODO: Implement write method
        return this;
    }
} 