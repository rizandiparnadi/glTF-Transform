import { ExtensionProperty, type IProperty } from '@gltf-transform/core';
import { KHR_PHYSICS_RIGID_BODIES } from '../constants.js';

export enum Axis {
    X = 0,
    Y = 1,
    Z = 2
}

interface IConstraintLimit extends IProperty {
    min: number | null;
    max: number | null;
    stiffness: number;
    damping: number;
    linearAxes: Array<Axis>;
    angularAxes: Array<Axis>;
}

/**
 * Describes a constraint limit for a joint. See {@link KHRPhysicsRigidBodies}.
 */
export class ConstraintLimit extends ExtensionProperty<IConstraintLimit> {
    public static EXTENSION_NAME = KHR_PHYSICS_RIGID_BODIES;
    public declare extensionName: typeof KHR_PHYSICS_RIGID_BODIES;
    public declare propertyType: 'ConstraintLimit';
    public declare parentTypes: ['JointDescription'];

    protected init(): void {
        this.extensionName = KHR_PHYSICS_RIGID_BODIES;
        this.propertyType = 'ConstraintLimit';
        this.parentTypes = ['JointDescription'];
    }

    protected getDefaults(): IConstraintLimit {
        return Object.assign(super.getDefaults() as IProperty, {
            min: null,
            max: null,
            stiffness: 0.0,
            damping: 0.0,
            linearAxes: [],
            angularAxes: []
        });
    }

    public getMin(): number | null {
        return this.get('min');
    }
    public setMin(min: number | null): this {
        return this.set('min', min);
    }

    public getMax(): number | null {
        return this.get('max');
    }
    public setMax(max: number | null): this {
        return this.set('max', max);
    }

    public getStiffness(): number {
        return this.get('stiffness');
    }
    public setStiffness(stiffness: number): this {
        return this.set('stiffness', stiffness);
    }

    public getDamping(): number {
        return this.get('damping');
    }
    public setDamping(damping: number): this {
        return this.set('damping', damping);
    }

    public getLinearAxes(): number[] {
        return this.get('linearAxes');
    }
    public setLinearAxes(axes: number[]): this {
        return this.set('linearAxes', axes);
    }

    public getAngularAxes(): number[] {
        return this.get('angularAxes');
    }
    public setAngularAxes(axes: number[]): this {
        return this.set('angularAxes', axes);
    }

    /**
     * Convenience method: set multiple parameters in one call.
     */
    public setParameters(params: Partial<{
        min: number;
        max: number;
        stiffness: number;
        damping: number;
        linearAxes: number[];
        angularAxes: number[];
    }>): this {
        if ('min' in params) this.setMin(params.min!);
        if ('max' in params) this.setMax(params.max!);
        if ('stiffness' in params) this.setStiffness(params.stiffness!);
        if ('damping' in params) this.setDamping(params.damping!);
        if ('linearAxes' in params) this.setLinearAxes(params.linearAxes!);
        if ('angularAxes' in params) this.setAngularAxes(params.angularAxes!);
        return this;
    }
} 