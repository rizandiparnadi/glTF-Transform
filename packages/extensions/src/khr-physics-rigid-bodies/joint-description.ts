import { ExtensionProperty, PropertyType, RefList, type IProperty } from '@gltf-transform/core';
import { KHR_PHYSICS_RIGID_BODIES } from '../constants.js';
import type { ConstraintDrive } from './constraint-drive.js';
import type { ConstraintLimit } from './constraint-limit.js';


interface IJointDescription extends IProperty {
    limits: RefList<ConstraintLimit>;
    drives: RefList<ConstraintDrive>;
}

/**
 * Describes the limits and drives for a joint. See {@link KHRPhysicsRigidBodies}.
 */
export class JointDescription extends ExtensionProperty<IJointDescription> {
    public static EXTENSION_NAME = KHR_PHYSICS_RIGID_BODIES;
    public declare extensionName: typeof KHR_PHYSICS_RIGID_BODIES;
    public declare propertyType: 'JointDescription';
    public declare parentTypes: [PropertyType.ROOT];

    protected init(): void {
        this.extensionName = KHR_PHYSICS_RIGID_BODIES;
        this.propertyType = 'JointDescription';
        this.parentTypes = [PropertyType.ROOT];
    }

    protected getDefaults(): IJointDescription {
        return Object.assign(super.getDefaults() as IProperty, {
            limits: new RefList<ConstraintLimit>(),
            drives: new RefList<ConstraintDrive>()
        });
    }

    /** Adds a ConstraintLimit to this joint description. */
    public addLimit(limit: ConstraintLimit): this {
        return this.addRef('limits', limit);
    }

    public addLimits(limits: ConstraintLimit[]): this {
        for (const limit of limits)
            this.addRef('limits', limit);
        return this;
    }

    /** Removes a ConstraintLimit from this joint description. */
    public removeLimit(limit: ConstraintLimit): this {
        return this.removeRef('limits', limit);
    }

    /** Lists ConstraintLimits in this joint description. */
    public listLimits(): ConstraintLimit[] {
        return this.listRefs('limits');
    }

    /** Adds a ConstraintDrive to this joint description. */
    public addDrive(drive: ConstraintDrive): this {
        return this.addRef('drives', drive);
    }

    public addDrives(drives: ConstraintDrive[]): this {
        for (const drive of drives)
            this.addRef('drives', drive);
        return this;
    }

    /** Removes a ConstraintDrive from this joint description. */
    public removeDrive(drive: ConstraintDrive): this {
        return this.removeRef('drives', drive);
    }

    /** Lists ConstraintDrives in this joint description. */
    public listDrives(): ConstraintDrive[] {
        return this.listRefs('drives');
    }
} 