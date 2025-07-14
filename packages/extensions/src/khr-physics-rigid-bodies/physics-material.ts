import { ExtensionProperty, PropertyType, type IProperty } from '@gltf-transform/core';
import { KHR_PHYSICS_RIGID_BODIES } from '../constants.js';

/** Determines how physical properties (restitution & friction) of two colliding objects are combined. */
export type PhysicalPropertyCombineType = 'average' | 'minimum' | 'maximum' | 'multiply';

interface IPhysicsMaterial extends IProperty {
    staticFriction: number;
    dynamicFriction: number;
    restitution: number;
    restitutionCombine: PhysicalPropertyCombineType;
    frictionCombine: PhysicalPropertyCombineType;
}

/**
 * Describes how pairs of objects react to collisions. See {@link KHRPhysicsRigidBodies}.
 */
export class PhysicsMaterial extends ExtensionProperty<IPhysicsMaterial> {
    public static EXTENSION_NAME = KHR_PHYSICS_RIGID_BODIES;
    public declare extensionName: typeof KHR_PHYSICS_RIGID_BODIES;
    public declare propertyType: 'PhysicsMaterial';
    public declare parentTypes: [PropertyType.NODE];

    protected init(): void {
        this.extensionName = KHR_PHYSICS_RIGID_BODIES;
        this.propertyType = 'PhysicsMaterial';
        this.parentTypes = [PropertyType.NODE];
    }

    protected getDefaults(): IPhysicsMaterial {
        return Object.assign(super.getDefaults() as IProperty, {
            staticFriction: 0.6,
            dynamicFriction: 0.6,
            restitution: 0.0,
            restitutionCombine: 'average' as PhysicalPropertyCombineType,
            frictionCombine: 'average' as PhysicalPropertyCombineType
        });
    }

    /** The friction used when an object is laying still on a surface. Usually a value from 0 to 1. A value of 0 feels like ice, a value of 1 will make it very hard to get the object moving. Simulations which do not differentiate between static and dynamic friction should use the dynamic friction value. */
    public getStaticFriction(): number {
        return this.get('staticFriction') as number;
    }

    /** The friction used when an object is laying still on a surface. Usually a value from 0 to 1. A value of 0 feels like ice, a value of 1 will make it very hard to get the object moving. Simulations which do not differentiate between static and dynamic friction should use the dynamic friction value. */
    public setStaticFriction(friction: number): this {
        return this.set('staticFriction', friction);
    }

    /** The friction used when already moving. Usually a value from 0 to 1. A value of 0 feels like ice, a value of 1 will make it come to rest very quickly unless a lot of force or gravity pushes the object. */
    public getDynamicFriction(): number {
        return this.get('dynamicFriction') as number;
    }

    /** The friction used when already moving. Usually a value from 0 to 1. A value of 0 feels like ice, a value of 1 will make it come to rest very quickly unless a lot of force or gravity pushes the object. */
    public setDynamicFriction(friction: number): this {
        return this.set('dynamicFriction', friction);
    }

    /** How bouncy is the surface? A value of 0 will not bounce. A value of 1 will bounce without any loss of energy. */
    public getRestitution(): number {
        return this.get('restitution') as number;
    }

    /** How bouncy is the surface? A value of 0 will not bounce. A value of 1 will bounce without any loss of energy. */
    public setRestitution(restitution: number): this {
        return this.set('restitution', restitution);
    }

    /** Determines how friction should be combined when two objects interact. */
    public getRestitutionCombine(): PhysicalPropertyCombineType {
        return this.get('restitutionCombine');
    }

    /** Determines how friction should be combined when two objects interact. */
    public setRestitutionCombine(combine: PhysicalPropertyCombineType): this {
        return this.set('restitutionCombine', combine);
    }

    /** Determines how restitution should be combined when two objects interact. */
    public getFrictionCombine(): PhysicalPropertyCombineType {
        return this.get('frictionCombine');
    }

    /** Determines how restitution should be combined when two objects interact. */
    public setFrictionCombine(combine: PhysicalPropertyCombineType): this {
        return this.set('frictionCombine', combine);
    }
} 