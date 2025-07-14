import { ExtensionProperty, PropertyType, type IProperty, type Nullable } from '@gltf-transform/core';
import { KHR_PHYSICS_RIGID_BODIES } from '../constants.js';
import { Geometry } from './geometry.js';
import { PhysicsMaterial } from './physics-material.js';


interface ICollider extends IProperty {
    geometry: Geometry;
    physicsMaterial: PhysicsMaterial;
    collisionFilter: any;  // TODO: Implement
}

/**
 * Describes the physical representation of a node's shape for collision detection. See {@link KHRPhysicsRigidBodies}.
 */
export class Collider extends ExtensionProperty<ICollider> {
    public static EXTENSION_NAME = KHR_PHYSICS_RIGID_BODIES;
    public static referenceFields = ['geometry'] as const;
    public declare extensionName: typeof KHR_PHYSICS_RIGID_BODIES;
    public declare propertyType: 'Collider';
    public declare parentTypes: [PropertyType.NODE];

    protected init(): void {
        this.extensionName = KHR_PHYSICS_RIGID_BODIES;
        this.propertyType = 'Collider';
        this.parentTypes = [PropertyType.NODE];
    }

    protected getDefaults(): ICollider {
        return Object.assign(super.getDefaults() as IProperty, {
            geometry: new Geometry(this.graph),
            physicsMaterial: new PhysicsMaterial(this.graph),
            collisionFilter: null
        });
    }

    /** The geometry used for this collider. */
    public getGeometry(): Geometry {
        return this.getRef('geometry')!;
    }

    /** The geometry used for this collider. */
    public setGeometry(geometry: Geometry): this {
        return this.setRef('geometry', geometry);
    }

    /** The physics material index for this collider. */
    public getPhysicsMaterial(): PhysicsMaterial {
        return this.getRef('physicsMaterial')!;
    }

    /** The physics material index for this collider. */
    public setPhysicsMaterial(material: PhysicsMaterial): this {
        return this.setRef('physicsMaterial', material);
    }

    /** The collision filter index for this collider. */
    public getCollisionFilter(): number | null {
        return this.get('collisionFilter') as number | null;
    }

    /** The collision filter index for this collider. */
    public setCollisionFilter(index: number | null): this {
        return this.set('collisionFilter', index);
    }
} 