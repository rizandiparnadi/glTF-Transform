import { ExtensionProperty, PropertyType, type IProperty, type Nullable } from '@gltf-transform/core';
import { KHR_PHYSICS_RIGID_BODIES } from '../constants.js';
import { Motion } from './motion.js';
import { Collider } from './collider.js';

interface IRigidBody extends IProperty {
    motion: Motion;
    collider: Collider;
}

/**
 * The main rigid body property attached to a node. May contain one or more of the following properties: Motion, Collider, Trigger, Joint. See {@link KHRPhysicsRigidBodies}.
 */
export class RigidBody extends ExtensionProperty<IRigidBody> {
    public static EXTENSION_NAME = KHR_PHYSICS_RIGID_BODIES;
    public declare extensionName: typeof KHR_PHYSICS_RIGID_BODIES;
    public declare propertyType: 'RigidBody';
    public declare parentTypes: [PropertyType.NODE];

    protected init(): void {
        this.extensionName = KHR_PHYSICS_RIGID_BODIES;
        this.propertyType = 'RigidBody';
        this.parentTypes = [PropertyType.NODE];
    }

    protected getDefaults(): Nullable<IRigidBody> {
        return Object.assign(super.getDefaults() as IProperty, {
            motion: null,
            collider: null
        });
    }

    /** The motion properties of this rigid body. */
    public getMotion(): Motion | null {
        return this.getRef('motion');
    }

    
    /** The motion properties of this rigid body. */
    public setMotion(motion: Motion | null): this {
        return this.setRef('motion', motion);
    }

    /** The collider properties of this rigid body. */
    public getCollider(): Collider | null {
        return this.getRef('collider');
    }

    /** The collider properties of this rigid body. */
    public setCollider(collider: Collider | null): this {
        return this.setRef('collider', collider);
    }
} 