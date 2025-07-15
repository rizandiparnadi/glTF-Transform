import { ExtensionProperty, Node, PropertyType, type IProperty, type Nullable } from '@gltf-transform/core';
import { KHR_PHYSICS_RIGID_BODIES } from '../constants.js';
import type { JointDescription } from './joint-description.js';

interface IJoint extends IProperty {
    connectedNode: Node;
    joint: JointDescription;
    enableCollision: boolean;
}

/**
 * Describes a joint constraint between this node and another node. See {@link KHRPhysicsRigidBodies}.
 */
export class Joint extends ExtensionProperty<IJoint> {
    public static EXTENSION_NAME = KHR_PHYSICS_RIGID_BODIES;
    public declare extensionName: typeof KHR_PHYSICS_RIGID_BODIES;
    public declare propertyType: 'Joint';
    public declare parentTypes: [PropertyType.NODE];

    protected init(): void {
        this.extensionName = KHR_PHYSICS_RIGID_BODIES;
        this.propertyType = 'Joint';
        this.parentTypes = [PropertyType.NODE];
    }

    protected getDefaults(): Nullable<IJoint> {
        return Object.assign(super.getDefaults() as IProperty, {
            connectedNode: null,
            joint: null,
            enableCollision: false
        });
    }

    /** The node to which this joint is connected. */
    public getConnectedNode(): Node | null {
        return this.getRef('connectedNode');
    }

    /** Sets the node to which this joint is connected. */
    public setConnectedNode(node: Node | null): this {
        return this.setRef('connectedNode', node as Node);
    }

    /** The index of the joint description (limits, drives, etc.). */
    public getJointDescription(): JointDescription | null {
        return this.getRef('joint');
    }

    /** Sets the index of the joint description (limits, drives, etc.). */
    public setJointDescription(desc: JointDescription | null): this {
        return this.setRef('joint', desc);
    }

    /** Whether collision is enabled between the connected bodies. */
    public getEnableCollision(): boolean {
        return this.get('enableCollision');
    }

    /** Sets whether collision is enabled between the connected bodies. */
    public setEnableCollision(enable: boolean): this {
        return this.set('enableCollision', enable);
    }
} 