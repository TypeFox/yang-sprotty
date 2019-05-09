/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

/** @jsx svg */
import { svg } from 'snabbdom-jsx';
import { injectable } from 'inversify';
import { RenderingContext, SEdge, SCompartment, PolylineEdgeView, Point, toDegrees, IView, setAttr } from "sprotty"
import { VNode } from "snabbdom/vnode"
import { YangNode, ModuleNode, Tag } from "./yang-models"

@injectable()
export class ClassNodeView implements IView {
    render(node: YangNode, context: RenderingContext): VNode {
        const vnode = <g class-sprotty-node={true}>
            <rect class-selected={node.selected} class-mouseover={node.hoverFeedback}
                  x={0} y={0}
                  width={Math.max(0, node.bounds.width)} height={Math.max(0, node.bounds.height)}/>
            {context.renderChildren(node)}
        </g>
        setAttr(vnode, 'class', node.cssClass)
        return vnode
    }
}

@injectable()
export class HeaderCompartmentView implements IView {
    render(model: SCompartment, context: RenderingContext): VNode {
        const translate = `translate(${model.bounds.x}, ${model.bounds.y})`
        const parentSize = (model.parent as any).size
        const width = Math.max(0, parentSize.width)
        const height = Math.max(0, model.size.height)
        const vnode = <g transform={translate} class-comp="{true}">
            <rect class-classHeader={true} x={0} y={0} width={width} height={height}></rect>
            {context.renderChildren(model)}
        </g>
        return vnode
    }
}

@injectable()
export class TagView implements IView {
    render(element: Tag, context: RenderingContext): VNode {
        const radius = 0.5 * element.size.width
        return <g>
            <circle class-tag={true} r={radius} cx={radius} cy={radius}></circle>
            {context.renderChildren(element)}
        </g>
    }
}

@injectable()
export class ModuleNodeView implements IView {
    render(node: ModuleNode, context: RenderingContext): VNode {
        return <g class-sprotty-node={true} class-module={true} class-mouseover={node.hoverFeedback}>
            <rect class-body={true} class-selected={node.selected}
                  x={0} y={0} rx="5" ry="5"
                  width={Math.max(0, node.bounds.width)} height={Math.max(0, node.bounds.height)}/>
            {context.renderChildren(node)}
        </g>
    }
}

@injectable()
export class ChoiceNodeView implements IView {
    render(model: YangNode, context: RenderingContext): VNode {
        const width = Math.max(0, model.size.width * 0.5)
        const height = Math.max(0, model.size.height * 0.5)
        const rhombStr = "M 0," + height + " l " + width + "," + height + " l " + width + ",-" + height + " l -" + width + ",-" + height + "z"

        return <g class-sprotty-node="{true}" class-choice={true}>
            <path d={rhombStr} class-choice={true}></path>
            {context.renderChildren(model)}
        </g>
    }
}

@injectable()
export class CaseNodeView implements IView {
    render(node: YangNode, context: RenderingContext): VNode {
        const vnode = <g class-sprotty-node="{true}">
            <rect class-body={true} class-selected={node.selected}
                  x={0} y={0}
                  width={Math.max(0, node.bounds.width)} height={Math.max(0, node.bounds.height)}
                  rx={Math.max(node.size.width * 0.5, 0)} ry={10}/>
            {context.renderChildren(node)}
        </g>
        setAttr(vnode, 'class', 'case')
        return vnode
    }
}

@injectable()
export class UsesNodeView extends CaseNodeView {
    render(node: YangNode, context: RenderingContext): VNode {
        const vnode = <g class-sprotty-node={true}>
            <rect class-body={true} class-selected={node.selected}
                  x={0} y={0}
                  width={Math.max(0, node.bounds.width)} height={Math.max(0, node.bounds.height)}
                  rx={Math.max(node.size.height * 0.5, 0)} ry={Math.max(node.size.height * 0.5, 0)}/>
            {context.renderChildren(node)}
        </g>
        setAttr(vnode, 'class', node.cssClass)
        return vnode
    }
}

@injectable()
export class NoteView implements IView {
    render(node: YangNode, context: RenderingContext): VNode {
        return <g class-note={true} class-mouseover={node.hoverFeedback}>
            <path class-front={true} d="M 0,0 l 15,0 l 0,10 l 10,0 l 0,25 l -25,0 Z" fill="#FFEB8A"/>
            <path class-noteEdge={true} d="M 15,0 l 0,10 l 10,0 Z" fill="#FFCC40"/>
        </g>
    }
}

@injectable()
export class CompositionEdgeView extends PolylineEdgeView {
    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[0]
        const p2 = segments[1]
        const r = 6
        const rhombStr = "M 0,0 l" + r + "," + (r / 2) + " l" + r + ",-" + (r / 2) + " l-" + r + ",-" + (r / 2) + " l-" + r + "," + (r / 2) + " Z"
        return [
            <path class-sprotty-edge={true} class-composition={true} d={rhombStr}
                  transform={`rotate(${angle(p1, p2)} ${p1.x} ${p1.y}) translate(${p1.x} ${p1.y})`}/>
        ]
    }

    static readonly SOURCE_CORRECTION = Math.sqrt(1 * 1 + 2 * 2)

    protected getSourceAnchorCorrection(edge: SEdge): number {
        return CompositionEdgeView.SOURCE_CORRECTION
    }
}

@injectable()
export class DashedEdgeView extends PolylineEdgeView {
    protected renderLine(edge: SEdge, segments: Point[], context: RenderingContext): VNode {
        const firstPoint = segments[0]
        let path = `M ${firstPoint.x},${firstPoint.y}`
        for (let i = 1; i < segments.length; i++) {
            const p = segments[i]
            path += ` L ${p.x},${p.y}`
        }
        return <path class-sprotty-edge={true} class-dashed={true} d={path}/>
    }
}

@injectable()
export class ImportEdgeView extends DashedEdgeView {
    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[0]
        const p2 = segments[1]
        return [
            <path class-sprotty-edge={true} d="M 10,-4 L 0,0 L 10,4"
                  transform={`rotate(${angle(p1, p2)} ${p1.x} ${p1.y}) translate(${p1.x} ${p1.y})`}/>
        ]
    }

    static readonly SOURCE_CORRECTION = Math.sqrt(1 * 1 + 2.5 * 2.5)

    protected getSourceAnchorCorrection(edge: SEdge): number {
        return CompositionEdgeView.SOURCE_CORRECTION
    }
}

@injectable()
export class ArrowEdgeView extends PolylineEdgeView {
    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[segments.length - 2]
        const p2 = segments[segments.length - 1]
        return [
            <path class-sprotty-edge={true} d="M 10,-4 L 0,0 L 10,4"
                  transform={`rotate(${angle(p2, p1)} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}/>
        ]
    }

    static readonly TARGET_CORRECTION = Math.sqrt(1 * 1 + 2.5 * 2.5)

    protected getTargetAnchorCorrection(edge: SEdge): number {
        return ArrowEdgeView.TARGET_CORRECTION
    }
}

@injectable()
export class DashedArrowEdgeView extends DashedEdgeView {
    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[segments.length - 2]
        const p2 = segments[segments.length - 1]
        return [
            <path class-sprotty-edge={true} d="M 10,-4 L 0,0 L 10,4"
                  transform={`rotate(${angle(p2, p1)} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}/>
        ]
    }

    static readonly TARGET_CORRECTION = Math.sqrt(1 * 1 + 2.5 * 2.5)

    protected getTargetAnchorCorrection(edge: SEdge): number {
        return DashedArrowEdgeView.TARGET_CORRECTION
    }
}

export function angle(x0: Point, x1: Point): number {
    return toDegrees(Math.atan2(x1.y - x0.y, x1.x - x0.x))
}