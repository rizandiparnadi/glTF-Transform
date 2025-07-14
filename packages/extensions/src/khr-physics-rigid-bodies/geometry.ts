import { ExtensionProperty, Node, PropertyType, type IProperty, type Nullable } from '@gltf-transform/core';
import { KHR_PHYSICS_RIGID_BODIES } from '../constants.js';

// TODO: How to import from @gltf-transform/extensions package properly instead of relative import?
import { Box, Capsule, Cylinder, Sphere } from '../khr-implicit-shapes/index.js';

// TODO: shape and node are optional
interface IGeometry extends IProperty {
    shape: Box | Sphere | Capsule | Cylinder | Node;
}

/**
 * Describes the geometrical representation of this collider. See {@link KHRPhysicsRigidBodies}.
 */
export class Geometry extends ExtensionProperty<IGeometry> {
    public static EXTENSION_NAME = KHR_PHYSICS_RIGID_BODIES;
    public declare extensionName: typeof KHR_PHYSICS_RIGID_BODIES;
    public declare propertyType: 'Geometry';
    public declare parentTypes: [PropertyType.NODE];

    protected init(): void {
        this.extensionName = KHR_PHYSICS_RIGID_BODIES;
        this.propertyType = 'Geometry';
        this.parentTypes = [PropertyType.NODE];
    }

    protected getDefaults(): Nullable<IGeometry> {
        return Object.assign(super.getDefaults() as IProperty, {
            shape: null
        });
    }

    /**
     * The shape used for physics simulation.
     * Box, Sphere, Capsule, Cylinder are implicit shapes.
     * Node is a convex hull.
    */
    public getShape(): Box | Sphere | Capsule | Cylinder | Node | null {
        return this.getRef('shape');
    }

    /**
     * The shape used for physics simulation.
     * Box, Sphere, Capsule, Cylinder are implicit shapes.
     * Node is a convex hull.
    */
    public setShape(shape: Box | Sphere | Capsule | Cylinder | Node | null): this {
        return this.setRef('shape', shape);
    }

    /** Whether it is an implicit shape or a convex hull. */
    public isConvexHull(): boolean {
        if (this.getShape() instanceof Node)
            return true;
        else
            return false;
    }
} 