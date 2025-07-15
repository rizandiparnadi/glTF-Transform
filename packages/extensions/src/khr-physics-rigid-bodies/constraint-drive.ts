import { ExtensionProperty, PropertyType, type IProperty, type Nullable } from '@gltf-transform/core';
import { KHR_PHYSICS_RIGID_BODIES } from '../constants.js';
import type { Axis } from './constraint-limit.js';

interface IConstraintDrive extends IProperty {
    type: 'linear' | 'angular' | null;
    mode: 'force' | 'acceleration' | null;
    axis: Axis | null;
    positionTarget: number;
    velocityTarget: number;
    maxForce: number;
    damping: number;
    stiffness: number;
}

/**
 * Describes a constraint drive for a joint. See {@link KHRPhysicsRigidBodies}.
 */
export class ConstraintDrive extends ExtensionProperty<IConstraintDrive> {
    public static EXTENSION_NAME = KHR_PHYSICS_RIGID_BODIES;
    public declare extensionName: typeof KHR_PHYSICS_RIGID_BODIES;
    public declare propertyType: 'ConstraintDrive';
    public declare parentTypes: ['JointDescription'];

    protected init(): void {
        this.extensionName = KHR_PHYSICS_RIGID_BODIES;
        this.propertyType = 'ConstraintDrive';
        this.parentTypes = ['JointDescription'];
    }

    protected getDefaults(): Nullable<IConstraintDrive> {
        return Object.assign(super.getDefaults() as IProperty, {
            type: null,
            mode: null,
            axis: null,
            positionTarget: null,
            velocityTarget: null,
            maxForce: 0.0,
            damping: 0.0,
            stiffness: 0.0
        });
    }

    public getType(): 'linear' | 'angular' | null {
        return this.get('type');
    }

    public setType(type: 'linear' | 'angular' | null): this {
        return this.set('type', type);
    }

    public getMode(): 'force' | 'acceleration' | null {
        return this.get('mode');
    }

    public setMode(mode: 'force' | 'acceleration' | null): this {
        return this.set('mode', mode);
    }

    public getAxis(): Axis | null {
        return this.get('axis');
    }

    public setAxis(axis: Axis | null): this {
        return this.set('axis', axis);
    }

    public getPositionTarget(): number {
        return this.get('positionTarget');
    }

    public setPositionTarget(positionTarget: number): this {
        return this.set('positionTarget', positionTarget);
    }

    public getVelocityTarget(): number {
        return this.get('velocityTarget');
    }

    public setVelocityTarget(velocityTarget: number): this {
        return this.set('velocityTarget', velocityTarget);
    }

    public getMaxForce(): number {
        return this.get('maxForce');
    }

    public setMaxForce(maxForce: number): this {
        return this.set('maxForce', maxForce);
    }

    public getDamping(): number {
        return this.get('damping');
    }

    public setDamping(damping: number): this {
        return this.set('damping', damping);
    }

    public getStiffness(): number {
        return this.get('stiffness');
    }

    public setStiffness(stiffness: number): this {
        return this.set('stiffness', stiffness);
    }

    /**
     * Convenience method: set multiple parameters in one call.
     */
    public setParameters(params: Partial<{
        type: 'linear' | 'angular' | null;
        mode: 'force' | 'acceleration' | null;
        axis: Axis | null;
        positionTarget: number;
        velocityTarget: number;
        maxForce: number;
        damping: number;
        stiffness: number;
    }>): this {
        if ('type' in params) this.setType(params.type!);
        if ('mode' in params) this.setMode(params.mode!);
        if ('axis' in params) this.setAxis(params.axis!);
        if ('positionTarget' in params) this.setPositionTarget(params.positionTarget!);
        if ('velocityTarget' in params) this.setVelocityTarget(params.velocityTarget!);
        if ('maxForce' in params) this.setMaxForce(params.maxForce!);
        if ('damping' in params) this.setDamping(params.damping!);
        if ('stiffness' in params) this.setStiffness(params.stiffness!);
        return this;
    }
} 