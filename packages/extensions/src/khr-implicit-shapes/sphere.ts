import { ExtensionProperty, PropertyType, type IProperty } from '@gltf-transform/core';
import { KHR_IMPLICIT_SHAPES } from '../constants.js';

interface ISphere extends IProperty {
    radius: number;
}

/**
 * A sphere centered at the origin in local space. See {@link KHRImplicitShapes}.
 */
export class Sphere extends ExtensionProperty<ISphere> {
    public static EXTENSION_NAME = KHR_IMPLICIT_SHAPES;
    public declare extensionName: typeof KHR_IMPLICIT_SHAPES;
    public declare propertyType: 'Sphere';
    public declare parentTypes: [PropertyType.NODE];

    protected init(): void {
        this.extensionName = KHR_IMPLICIT_SHAPES;
        this.propertyType = 'Sphere';
        this.parentTypes = [PropertyType.NODE];
    }

    protected getDefaults(): ISphere {
        return Object.assign(super.getDefaults() as IProperty, {
            radius: 0.5
        });
    }

    public getType(): 'sphere' {
        return 'sphere';
    }

    /** The radius of the sphere. */
    public getRadius(): number {
        return this.get('radius');
    }

    /** The radius of the sphere. */
    public setRadius(radius: number): this {
        // Sphere cannot be degenerate (radius of 0 or below).
        radius = Math.max(radius, Number.MIN_VALUE);
        return this.set('radius', radius);
    }
} 