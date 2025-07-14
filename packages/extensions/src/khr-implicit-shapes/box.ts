import { ExtensionProperty, PropertyType, type IProperty, type vec3 } from '@gltf-transform/core';
import { KHR_IMPLICIT_SHAPES } from '../constants.js';

interface IBox extends IProperty {
    size: vec3;
}

/**
 * An axis-aligned box centered at the origin in local space. See {@link KHRImplicitShapes}.
 */
export class Box extends ExtensionProperty<IBox> {
    public static EXTENSION_NAME = KHR_IMPLICIT_SHAPES;
    public declare extensionName: typeof KHR_IMPLICIT_SHAPES;
    public declare propertyType: 'Box';
    public declare parentTypes: [PropertyType.NODE];

    protected init(): void {
        this.extensionName = KHR_IMPLICIT_SHAPES;
        this.propertyType = 'Box';
        this.parentTypes = [PropertyType.NODE];
    }

    protected getDefaults(): IBox {
        return Object.assign(super.getDefaults() as IProperty, {
            size: [1.0, 1.0, 1.0] as vec3
        });
    }

    public getType(): 'box' {
        return 'box';
    }

    /** The size of the box. */
    public getSize(): vec3 {
        return this.get('size');
    }

    /** The size of the box. */
    public setSize(size: vec3): this {
        return this.set('size', size);
    }
} 