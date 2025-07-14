import { ExtensionProperty, PropertyType, type IProperty, type vec3, type vec4 } from '@gltf-transform/core';
import { KHR_PHYSICS_RIGID_BODIES } from '../constants.js';

interface IMotion extends IProperty {
    isKinematic: boolean;
    mass: number;
    centerOfMass: vec3;
    inertiaOrientation: vec4;
    inertiaDiagonal: vec3;
    linearVelocity: vec3;
    angularVelocity: vec3;
    gravityFactor: number;
}

/**
 * Allows the simulation to move this node, describing parameters for that motion. See {@link KHRPhysicsRigidBodies}.
 */
export class Motion extends ExtensionProperty<IMotion> {
    public static EXTENSION_NAME = KHR_PHYSICS_RIGID_BODIES;
    public declare extensionName: typeof KHR_PHYSICS_RIGID_BODIES;
    public declare propertyType: 'Motion';
    public declare parentTypes: [PropertyType.NODE];

    protected init(): void {
        this.extensionName = KHR_PHYSICS_RIGID_BODIES;
        this.propertyType = 'Motion';
        this.parentTypes = [PropertyType.NODE];
    }

    protected getDefaults(): IMotion {
        return Object.assign(super.getDefaults() as IProperty, {
            isKinematic: false,
            mass: 1,
            centerOfMass: [0, 0, 0] as vec3,
            inertiaOrientation: [0, 0, 0, 1] as vec4,
            inertiaDiagonal: [1, 1, 1] as vec3,
            linearVelocity: [0, 0, 0] as vec3,
            angularVelocity: [0, 0, 0] as vec3,
            gravityFactor: 1
        });
    }

    /** When true, treat the rigid body as having infinite mass. Its velocity will be constant during simulation. */
    public isKinematic(): boolean {
        return this.get('isKinematic');
    }

    /** When true, treat the rigid body as having infinite mass. Its velocity will be constant during simulation. */
    public setIsKinematic(isKinematic: boolean): this {
        return this.set('isKinematic', isKinematic);
    }

    /** The mass of the rigid body. Larger values imply the rigid body is harder to move. */
    public getMass(): number {
        return this.get('mass');
    }

    /** The mass of the rigid body. Larger values imply the rigid body is harder to move. */
    public setMass(mass: number): this {
        return this.set('mass', mass);
    }

    /** Center of mass of the rigid body in node space. */
    public getCenterOfMass(): vec3 {
        return this.get('centerOfMass');
    }

    /** Center of mass of the rigid body in node space. */
    public setCenterOfMass(center: vec3): this {
        return this.set('centerOfMass', center);
    }

    /** The quaternion rotating from inertia major axis space to node space. */
    public getInertiaOrientation(): vec4 {
        return this.get('inertiaOrientation');
    }

    /** The quaternion rotating from inertia major axis space to node space. */
    public setInertiaOrientation(orientation: vec4): this {
        return this.set('inertiaOrientation', orientation);
    }

    /** The principal moments of inertia. Larger values imply the rigid body is harder to rotate. */
    public getInertiaDiagonal(): vec3 {
        return this.get('inertiaDiagonal');
    }

    /** The principal moments of inertia. Larger values imply the rigid body is harder to rotate. */
    public setInertiaDiagonal(diagonal: vec3): this {
        return this.set('inertiaDiagonal', diagonal);
    }

    /** Initial linear velocity of the rigid body in node space. */
    public getLinearVelocity(): vec3 {
        return this.get('linearVelocity');
    }

    /** Initial linear velocity of the rigid body in node space. */
    public setLinearVelocity(velocity: vec3): this {
        return this.set('linearVelocity', velocity);
    }

    /** Initial angular velocity of the rigid body in node space. */
    public getAngularVelocity(): vec3 {
        return this.get('angularVelocity');
    }

    /** Initial angular velocity of the rigid body in node space. */
    public setAngularVelocity(velocity: vec3): this {
        return this.set('angularVelocity', velocity);
    }

    /** Scalar value used to modify the effect of gravity on this motion. */
    public getGravityFactor(): number {
        return this.get('gravityFactor');
    }

    /** Scalar value used to modify the effect of gravity on this motion. */
    public setGravityFactor(factor: number): this {
        return this.set('gravityFactor', factor);
    }
} 