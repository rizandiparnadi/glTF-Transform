import { Extension, ReaderContext, WriterContext, type vec3 } from '@gltf-transform/core';
import { KHR_IMPLICIT_SHAPES } from '../constants.js';
import { Box } from './box.js';
import { Capsule } from './capsule.js';
import { Cylinder } from './cylinder.js';
import { Sphere } from './sphere.js';

const NAME = KHR_IMPLICIT_SHAPES;

interface SphereDef {
    radius: number;
}

interface BoxDef {
    size: vec3;
}

interface CylinderDef {
    height: number;
    radiusTop: number;
    radiusBottom: number;
}

interface CapsuleDef {
    height: number;
    radiusTop: number;
    radiusBottom: number;
}

interface ShapeDef {
    type: 'sphere' | 'box' | 'capsule' | 'cylinder';
    sphere?: SphereDef
    box?: BoxDef;
    capsule?: CapsuleDef;
    cylinder?: CylinderDef;
}

/** This is the top-level KHR_implicit_shapes extension property holding a shapes array. */
interface ImplicitShapesDef {
	shapes: ShapeDef[];
}

/**
 * [`KHR_implicit_shapes`](https://github.com/eoineoineoin/glTF_Physics/tree/master/extensions/2.0/Khronos/KHR_implicit_shapes).
 * This extension adds data definitions for implicit shapes. This extension does not mandate any particular behaviour for these
 * objects aside from a description of their geometry. These types are to be used in combination with other extensions which
 * should specify the behavior of these types. 
 * 
 * Properties:
 * - {@link Box} - Defines an axis-aligned box centered at the origin in local space.
 * - {@link Sphere} - Defines a sphere centered at the origin in local space.
 * - {@link Capsule} - A capsule (cylinder with hemispherical ends) centered at the origin and defined by two "capping" spheres with potentially different radii, aligned along the Y axis in local space.
 * - {@link Cylinder} - A cylinder centered at the origin and aligned along the Y axis in local space, with potentially different radii at each end. A cone is a special case of cylinder when one of the radii is zero.
 */
export class KHRImplicitShapes extends Extension {
    public static readonly EXTENSION_NAME = NAME;
    public readonly extensionName = NAME;
    private readonly shapes: Array<Sphere | Box | Capsule | Cylinder> = [];

    public createSphere(): Sphere {
        const sphere = new Sphere(this.document.getGraph());
        this.shapes.push(sphere);
        return sphere;
    }

    public createBox(): Box {
        const box = new Box(this.document.getGraph());
        this.shapes.push(box);
        return box;
    }

    public createCapsule(): Capsule {
        const capsule = new Capsule(this.document.getGraph());
        this.shapes.push(capsule);
        return capsule;
    }

    public createCylinder(): Cylinder {
        const cylinder = new Cylinder(this.document.getGraph());
        this.shapes.push(cylinder);
        return cylinder;
    }

    /** Returns the shape object at the given index in this extension. */
    public getShape(index: number): Sphere | Box | Capsule | Cylinder | null {
        return this.shapes[index] ?? null;
    }

    /** Returns the index of the shape object in this extension. */
    public getShapeIndex(shape: Sphere | Box | Capsule | Cylinder): number | undefined {
        let index = this.shapes.indexOf(shape);
        if (index == -1)
            return undefined;
        else
            return index;
    }

    /** Removes the shape from the list of shapes in this extension. */
    public deleteShape(shape: Sphere | Box | Capsule | Cylinder) {
        let index = this.shapes.indexOf(shape);
        while (index != -1) {
            this.shapes.splice(index, 1);
            index = this.shapes.indexOf(shape);
        }
    }

    /** Returns a readonly array of all shapes in this extension. */
    public getShapes(): ReadonlyArray<Sphere | Box | Capsule | Cylinder> {
        return this.shapes;
    }

    public read(context: ReaderContext): this {
        const jsonDoc = context.jsonDoc;

		if (!jsonDoc.json.extensions || !jsonDoc.json.extensions[NAME]) return this;

		const rootDef = jsonDoc.json.extensions[NAME] as ImplicitShapesDef;
		const shapeDefs = rootDef.shapes || ([] as ShapeDef[]);
		const shapes = shapeDefs.map((shapeDef) => {
            let shape: Sphere | Box | Cylinder | Capsule;
            switch(shapeDef.type) {
                case 'sphere':
                    shape = this.createSphere()
                        // NOTE: This assumes "sphere" property is always defined when "type" is "sphere", but do we need to actually check?
                        .setRadius(shapeDef.sphere!.radius);
                    break;
                case 'box': 
                    shape = this.createBox()
                        .setSize(shapeDef.box!.size);
                    break;
                case 'cylinder':
                    shape = this.createCylinder()
                        .setHeight(shapeDef.cylinder!.height)
                        .setRadiusTop(shapeDef.cylinder!.radiusTop)
                        .setRadiusBottom(shapeDef.cylinder!.radiusBottom);
                    break;
                case 'capsule':
                    shape = this.createCapsule()
                        .setHeight(shapeDef.capsule!.height)
                        .setRadiusTop(shapeDef.capsule!.radiusTop)
                        .setRadiusBottom(shapeDef.capsule!.radiusBottom);
                    break;
            }

			return shape;
		});

		return this;
    }

    public write(context: WriterContext): this {
        const jsonDoc = context.jsonDoc;

		if (this.properties.size === 0) return this;

		jsonDoc.json.extensions = jsonDoc.json.extensions || {};
		jsonDoc.json.extensions[NAME] = {
            shapes: this.shapes.map(shape => shapeToShapeDef(shape))
        } satisfies ImplicitShapesDef;

		return this;
    }
}

/** Converts a TS-side shape ExtensionProperty into the appropriate GLTF Json object. */
function shapeToShapeDef(shape: Sphere | Box | Capsule | Cylinder): ShapeDef {
    return {
        type: shape.getType(),
        sphere: (shape instanceof Sphere) ? { radius: shape.getRadius() } : undefined,
        box: (shape instanceof Box) ? { size: shape.getSize() } : undefined,
        capsule: (shape instanceof Capsule) ? { height: shape.getHeight(), radiusTop: shape.getRadiusTop(), radiusBottom: shape.getRadiusBottom() } : undefined,
        cylinder: (shape instanceof Cylinder) ?{ height: shape.getHeight(), radiusTop: shape.getRadiusTop(), radiusBottom: shape.getRadiusBottom() } : undefined,
    };
}