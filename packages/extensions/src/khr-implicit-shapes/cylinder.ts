import { ExtensionProperty, PropertyType, type IProperty } from '@gltf-transform/core';
import { KHR_IMPLICIT_SHAPES } from '../constants.js';

interface ICylinder extends IProperty {
    height: number;
    radiusTop: number;
    radiusBottom: number;
}

/**
 * A cylinder centered at the origin and aligned along the Y axis in local space, with potentially different radii at each end.
 * A cone is a special case of cylinder when one of the radii is zero. See {@link KHRImplicitShapes}.
 */
export class Cylinder extends ExtensionProperty<ICylinder> {
    public static EXTENSION_NAME = KHR_IMPLICIT_SHAPES;
    public declare extensionName: typeof KHR_IMPLICIT_SHAPES;
    public declare propertyType: 'Cylinder';
    public declare parentTypes: [PropertyType.NODE];

    protected init(): void {
        this.extensionName = KHR_IMPLICIT_SHAPES;
        this.propertyType = 'Cylinder';
        this.parentTypes = [PropertyType.NODE];
    }

    protected getDefaults(): ICylinder {
        return Object.assign(super.getDefaults() as IProperty, {
            height: 0.5,
            radiusTop: 0.25,
            radiusBottom: 0.25
        });
    }

    public getType(): 'cylinder' {
        return 'cylinder';
    }

    /** The height of the cylinder. */
    public getHeight(): number {
        return this.get('height');
    }

    /** The height of the cylinder. */
    public setHeight(height: number): this {
        // Cylinder cannot be degenerate (height of 0 or below).
        height = Math.max(height, Number.MIN_VALUE);
        return this.set('height', height);
    }

    /** The radius of the top face of the cylinder. */
    public getRadiusTop(): number {
        return this.get('radiusTop');
    }

    /** The radius of the top face of the cylinder. */
    public setRadiusTop(radius: number): this {
        // Capsule cannot be degenerate (radius of 0 or below).
        radius = Math.max(radius, Number.MIN_VALUE);
        return this.set('radiusTop', radius);
    }

    /** The radius of the bottom face of the cylinder. */
    public getRadiusBottom(): number {
        return this.get('radiusBottom');
    }

    /** The radius of the bottom face of the cylinder. */
    public setRadiusBottom(radius: number): this {
        // Capsule cannot be degenerate (radius of 0 or below).
        radius = Math.max(radius, Number.MIN_VALUE);
        return this.set('radiusBottom', radius);
    }
} 