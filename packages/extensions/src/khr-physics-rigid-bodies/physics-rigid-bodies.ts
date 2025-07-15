import { Extension, Node, ReaderContext, WriterContext, type vec3, type vec4, } from '@gltf-transform/core';
import { KHR_PHYSICS_RIGID_BODIES } from '../constants.js';
import { KHRImplicitShapes } from '../khr-implicit-shapes/implicit-shapes.js';
import { Box, Capsule, Cylinder, Sphere } from '../khr-implicit-shapes/index.js';
import { Collider } from './collider.js';
import { ConstraintDrive } from './constraint-drive.js';
import { ConstraintLimit, type Axis } from './constraint-limit.js';
import { Geometry } from './geometry.js';
import { JointDescription } from './joint-description.js';
import { Joint } from './joint.js';
import { Motion } from './motion.js';
import { PhysicsMaterial, type PhysicalPropertyCombineType } from './physics-material.js';
import { RigidBody } from './rigid-body.js';

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
    trigger: any;  // TODO: Implement
    joint?: JointDef;
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
    physicsMaterials?: PhysicsMaterialDef[];
    collisionFilters?: any;
    physicsJoints?: JointDescriptionDef[];
}

interface ConstraintDriveDef
{
    type?: 'linear' | 'angular';
    mode?: 'force' | 'acceleration';
    axis?: number;
    positionTarget: number;
    velocityTarget: number;
    maxForce?: number;
    damping: number;
    stiffness: number;
}

interface ConstraintLimitDef
{
    min?: number;
    max?: number;
    stiffness?: number;
    damping?: number;

    linearAxes?: Array<Axis>;  //  (0=X, 1=Y, 2=Z).
    angularAxes?: Array<Axis>;  //  (0=X, 1=Y, 2=Z).
}

interface JointDescriptionDef
{
    limits: Array<ConstraintLimitDef>;
    drives: Array<ConstraintDriveDef>;
}

interface JointDef
{
    connectedNode: number;  // Index of a node to use for one attachment frame
    joint: number;  // Index of a top-level KHR_physics_rigid_bodies.joint describing limits and drives
    enableCollision: boolean;
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
 * TODO:
 * - Joints, Constrains the motion of this node relative to another.
 * - Collision filters, which allow for control over which pairs of nodes should collide.
 * - Triggers, Describes a volume which can detect collisions, but does not generate a physical response.
 */
export class KHRPhysicsRigidBodies extends Extension {
    public static readonly EXTENSION_NAME = NAME;
    public readonly extensionName = NAME;
    private physicsMaterials: Array<PhysicsMaterial> = [];
    private physicsJoints: Array<JointDescription> = [];

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

    public createJoint(): Joint {
        return new Joint(this.document.getGraph());
    }

    public createJointDescription(): JointDescription {
        return new JointDescription(this.document.getGraph());
    }

    public createConstraintLimit(): ConstraintLimit {
        return new ConstraintLimit(this.document.getGraph());
    }

    public createConstraintDrive(): ConstraintDrive {
        return new ConstraintDrive(this.document.getGraph());
    }

    public read(context: ReaderContext): this {
        const jsonDoc = context.jsonDoc;

		if (!jsonDoc.json.extensions || !jsonDoc.json.extensions[NAME]) return this;

        // Top-level.
        const extensionRoot = jsonDoc.json.extensions[NAME] as PhysicsRigidBodiesRootDef;

        // This extension depends on the KHR_implicit_shapes extension.
        const implicitShapesExtension = this.document.createExtension(KHRImplicitShapes);

        /** Turn the glTF-side JSON PhysicsMaterialDef into the TS-side PhysicsMaterial. */
        this.physicsMaterials = extensionRoot.physicsMaterials?.map(physicsMaterialDef => {
            return this.createPhysicsMaterial()
                .setStaticFriction(physicsMaterialDef.staticFriction)
                .setDynamicFriction(physicsMaterialDef.dynamicFriction)
                .setRestitution(physicsMaterialDef.restitution)
                .setRestitutionCombine(physicsMaterialDef.restitutionCombine)
                .setFrictionCombine(physicsMaterialDef.frictionCombine);
        }) ?? [];

        const nodesList = this.document.getRoot().listNodes();

        /** Turn the glTF-side JSON JointDescriptionDef into the TS-side JointDescription. */
        this.physicsJoints = extensionRoot.physicsJoints?.map(jointDef => {
            return this.createJointDescription()
                .addLimits(
                    jointDef.limits.map(limit => this.createConstraintLimit().setParameters(limit))
                )
                .addDrives(
                    jointDef.drives.map(drive => this.createConstraintDrive().setParameters(drive))
                );
        }) ?? [];
    
        jsonDoc.json.nodes?.forEach((nodeDef, nodeIndex) => {
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
                collider.setPhysicsMaterial(this.physicsMaterials[colliderDef.physicsMaterial]) 
                // TODO: Get CollisionFilter from index.
                // .setCollisionFilter(colliderDef.collisionFilter)

                // Get shape from index
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

            /** Convert the glTF-side JSON JointDef object to TS-side Joint object. */
            const jointDef = rigidBodyNodeDef.joint;
            let joint: Joint | null = null;
            if (jointDef) {
                joint = this.createJoint()
                    .setConnectedNode(nodesList[jointDef.connectedNode])
                    .setJointDescription(this.physicsJoints[jointDef.joint])
                    .setEnableCollision(jointDef.enableCollision);
            }

            if (motion || collider || joint) {
                const rigidBody = this.createRigidBody();
                if (motion) rigidBody.setMotion(motion);
                if (collider) rigidBody.setCollider(collider);
                if (joint) rigidBody.setJoint(joint);

                context.nodes[nodeIndex].setExtension(NAME, rigidBody);
            }
        });

        return this;
    }

    public write(context: WriterContext): this {
        const jsonDoc = context.jsonDoc;

		if (this.properties.size === 0) return this;

        /** Turn the TS-side PhysicsMaterial into the glTF-side JSON PhysicsMaterialDef. */
        const physicsMaterialsDefs = this.physicsMaterials.map(material => {
            return {
                staticFriction: material.getStaticFriction(),
                dynamicFriction: material.getDynamicFriction(),
                restitution: material.getRestitution(),
                restitutionCombine: material.getRestitutionCombine(),
                frictionCombine: material.getFrictionCombine()
            }
        });

        // This extension depends on the KHR_implicit_shapes extension.
        const implicitShapesExtension = this.document.createExtension(KHRImplicitShapes);

        // Per-node extension objects.
		this.document
			.getRoot()
			.listNodes()
			.forEach((node: Node) => {
				const physics = node.getExtension<RigidBody>(KHR_PHYSICS_RIGID_BODIES);
                if (!physics) return;

                const motionDef = this.motionToJson(physics.getMotion())
                const colliderDef = this.colliderToJson(physics.getCollider(), implicitShapesExtension);
                const jointDef = this.jointToJson(physics.getJoint());

                const nodeIndex = context.nodeIndexMap.get(node)!;
                const nodeDef = jsonDoc.json.nodes![nodeIndex];
                nodeDef.extensions = nodeDef.extensions || {};
                nodeDef.extensions[KHR_PHYSICS_RIGID_BODIES] ={
                    motion: motionDef,
                    collider: colliderDef,
                    trigger: undefined,
                    joint: jointDef
                } satisfies RigidBodyDef;
			});

        /** Turn the TS-side Joint into the glTF-side JSON JointDef. */
        const physicsJointDescriptionDefs = this.physicsJoints.map(joint => {
            return {
                limits: joint.listLimits().map(limit => this.constraintLimitToJson(limit)),
                drives: joint.listDrives().map(drive => this.constraintDriveToJson(drive))
            } satisfies JointDescriptionDef;
        });

        // Top-level extension object.
		jsonDoc.json.extensions = jsonDoc.json.extensions || {};
		jsonDoc.json.extensions[KHR_PHYSICS_RIGID_BODIES] = {
            physicsMaterials: physicsMaterialsDefs,
            collisionFilters: undefined,
            physicsJoints: physicsJointDescriptionDefs  // TODO: Implement
        } satisfies PhysicsRigidBodiesRootDef;

		return this;
    }

    /** Converts a TS-side Motion ExtensionProperty into the appropriate GLTF Json object. */
    private motionToJson(motion: Motion | null): MotionDef | undefined {
        if (!motion) return undefined;

        return {
            isKinematic: motion.isKinematic(),
            mass: motion.getMass(),
            centerOfMass: motion.getCenterOfMass(),
            inertiaOrientation: motion.getInertiaOrientation(),
            inertiaDiagonal: motion.getInertiaDiagonal(),
            linearVelocity: motion.getLinearVelocity(),
            angularVelocity: motion.getAngularVelocity(),
            gravityFactor: motion.getGravityFactor()
        };
    }

    /** Converts a TS-side Collider ExtensionProperty into the appropriate GLTF Json object. */
    private colliderToJson(collider: Collider | null, shapesExtension: KHRImplicitShapes): ColliderDef | undefined {
        if (!collider) return undefined;

        return {
            geometry: this.geometryToJson(collider.getGeometry(), shapesExtension),
            physicsMaterial: getIndex(collider.getPhysicsMaterial(), this.physicsMaterials)!,
            collisionFilter: -1  // TODO: Implement
        };
    }

    /** Converts a TS-side Collider ExtensionProperty into the appropriate GLTF Json object. */
    private geometryToJson(geometry: Geometry, shapesExtension: KHRImplicitShapes): GeometryDef {
        const nodeList = this.document.getRoot().listNodes();

        const shape = geometry.getShape();
        if (!shape)
            return { convexHull: false }
        else if (shape instanceof Node)
            return { node: getIndex(shape, nodeList), convexHull: true };
        else
            return { shape: shapesExtension.getShapeIndex(shape), convexHull: false };
    }

    /** Converts a TS-side Joint ExtensionProperty into the appropriate GLTF Json object. */
    private jointToJson(joint: Joint | null): JointDef | undefined {
        if (!joint) return undefined;
    
        const connectedNode = joint.getConnectedNode();
        const jointDescription = joint.getJointDescription();
        const enableCollision = joint.getEnableCollision();
        const nodeList = this.document.getRoot().listNodes();
        const jointDescIndex = this.physicsJoints.indexOf(jointDescription!);
        
        return {
            connectedNode: getIndex(connectedNode, nodeList)!,
            joint: jointDescIndex,
            enableCollision: enableCollision
        };
    }

    /** Converts a TS-side ConstraintLimit ExtensionProperty into the appropriate GLTF Json object. */
    private constraintLimitToJson(limit: ConstraintLimit): ConstraintLimitDef {
        return {
            min: limit.getMin() ?? undefined,
            max: limit.getMax() ?? undefined,
            stiffness: limit.getStiffness(),
            damping: limit.getDamping(),
            linearAxes: limit.getLinearAxes(),
            angularAxes: limit.getAngularAxes(),
        };
    }

    /** Converts a TS-side ConstraintDrive ExtensionProperty into the appropriate GLTF Json object. */
    private constraintDriveToJson(drive: ConstraintDrive): ConstraintDriveDef {
        return {
            type: drive.getType() ?? undefined,
            mode: drive.getMode() ?? undefined,
            axis: drive.getAxis() ?? undefined,
            positionTarget: drive.getPositionTarget(),
            velocityTarget: drive.getVelocityTarget(),
            maxForce: drive.getMaxForce(),
            damping: drive.getDamping(),
            stiffness: drive.getStiffness(),
        };
    }
}

/** Returns the index of an object in an array. */
function getIndex<T>(element: T, array: T[]): number | undefined {
    let index = array.indexOf(element);
    if (index == -1)
        return undefined;
    else
        return index;
}