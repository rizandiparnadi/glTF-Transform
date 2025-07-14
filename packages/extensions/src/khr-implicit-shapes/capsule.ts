import { ExtensionProperty, PropertyType, type IProperty } from '@gltf-transform/core';
import { KHR_IMPLICIT_SHAPES } from '../constants.js';

interface ICapsule extends IProperty {
    height: number;
    radiusTop: number;
    radiusBottom: number;
}

/**
 * A capsule (cylinder with hemispherical ends) centered at the origin and defined by two "capping" spheres with potentially different radii, aligned along the Y axis in local space. See {@link KHRImplicitShapes}.
 */
export class Capsule extends ExtensionProperty<ICapsule> {
    public static EXTENSION_NAME = KHR_IMPLICIT_SHAPES;
    public declare extensionName: typeof KHR_IMPLICIT_SHAPES;
    public declare propertyType: 'Capsule';
    public declare parentTypes: [PropertyType.NODE];

    protected init(): void {
        this.extensionName = KHR_IMPLICIT_SHAPES;
        this.propertyType = 'Capsule';
        this.parentTypes = [PropertyType.NODE];
    }

    protected getDefaults(): ICapsule {
        return Object.assign(super.getDefaults() as IProperty, {
            height: 0.5,
            radiusTop: 0.25,
            radiusBottom: 0.25
        });
    }

    public getType(): 'capsule' {
        return 'capsule';
    }

    /** The height of the capsule. */
    public getHeight(): number {
        return this.get('height');
    }

    /** The height of the capsule. */
    public setHeight(height: number): this {
        // Capsule cannot be degenerate (height of 0 or below).
        height = Math.max(height, Number.MIN_VALUE);
        return this.set('height', height);
    }

    /** The radius of the top hemisphere of the capsule. */
    public getRadiusTop(): number {
        return this.get('radiusTop');
    }

    /** The radius of the top hemisphere of the capsule. */
    public setRadiusTop(radius: number): this {
        // Capsule cannot be degenerate (radius of 0 or below).
        radius = Math.max(radius, Number.MIN_VALUE);
        return this.set('radiusTop', radius);
    }

    /** The radius of the bottom hemisphere of the capsule. */
    public getRadiusBottom(): number {
        return this.get('radiusBottom');
    }

    /** The radius of the bottom hemisphere of the capsule. */
    public setRadiusBottom(radius: number): this {
        // Capsule cannot be degenerate (height of 0 or below).
        radius = Math.max(radius, Number.MIN_VALUE);
        return this.set('radiusBottom', radius);
    }
} 