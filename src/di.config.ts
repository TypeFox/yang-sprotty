/*
 * Copyright (C) 2017-2020 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { Container, ContainerModule } from "inversify";
import { ConsoleLogger, ExpandButtonHandler, ExpandButtonView, HtmlRoot,
        HtmlRootView, LogLevel, PolylineEdgeView, PreRenderedElement,
        PreRenderedView, SCompartment, SCompartmentView, SEdge, SGraph,
        SGraphView, SLabel, SLabelView, TYPES, configureModelElement,
        overrideViewerOptions, SButton, CustomFeatures, moveFeature, openFeature,
        expandFeature, selectFeature, loadDefaultModules } from 'sprotty';
import { ArrowEdgeView, CaseNodeView, ChoiceNodeView, ClassNodeView,
        CompositionEdgeView, DashedArrowEdgeView, DashedEdgeView, HeaderCompartmentView,
        ImportEdgeView, ModuleNodeView, NoteView, TagView, UsesNodeView } from "./views";
import { ModuleNode, Tag, YangLabel, YangNode } from "./yang-models";
import { YangModelFactory } from "./model-factory";
import 'sprotty/css/sprotty.css'

const yangDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope()
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn)
    rebind(TYPES.IModelFactory).to(YangModelFactory).inSingletonScope()

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, 'graph', SGraph, SGraphView);
    const nodeFeatures: CustomFeatures = {
        disable: [moveFeature],
        enable: [openFeature]
    };
    configureModelElement(context, 'node:class', YangNode, ClassNodeView, nodeFeatures)
    configureModelElement(context, 'node:choice', YangNode, ChoiceNodeView, nodeFeatures)
    configureModelElement(context, 'node:case', YangNode, CaseNodeView, nodeFeatures)
    configureModelElement(context, 'node:pill', YangNode, UsesNodeView, nodeFeatures)
    configureModelElement(context, 'node:note', YangNode, NoteView, nodeFeatures)
    const moduleFeatures: CustomFeatures = {
        disable: [moveFeature],
        enable: [openFeature, expandFeature]
    };
    configureModelElement(context, 'node:module', ModuleNode, ModuleNodeView, moduleFeatures)
    configureModelElement(context, 'label:heading', SLabel, SLabelView)
    const labelFeatures: CustomFeatures = {
        enable: [selectFeature, openFeature]
    };
    configureModelElement(context, 'label:text', YangLabel, SLabelView, labelFeatures)
    configureModelElement(context, 'label:classHeader', SLabel, SLabelView)
    configureModelElement(context, 'tag', Tag, TagView)
    configureModelElement(context, 'label:tag', SLabel, SLabelView)
    configureModelElement(context, 'comp:comp', SCompartment, SCompartmentView)
    configureModelElement(context, 'comp:classHeader', SCompartment, HeaderCompartmentView)
    configureModelElement(context, 'edge:straight', SEdge, PolylineEdgeView)
    configureModelElement(context, 'edge:composition', SEdge, CompositionEdgeView)
    configureModelElement(context, 'edge:dashed', SEdge, DashedEdgeView)
    configureModelElement(context, 'edge:import', SEdge, ImportEdgeView)
    configureModelElement(context, 'edge:uses', SEdge, DashedArrowEdgeView)
    configureModelElement(context, 'edge:augments', SEdge, ArrowEdgeView)
    configureModelElement(context, 'html', HtmlRoot, HtmlRootView)
    configureModelElement(context, 'pre-rendered', PreRenderedElement, PreRenderedView)
    configureModelElement(context, ExpandButtonHandler.TYPE, SButton, ExpandButtonView)
})

export default function createContainer(widgetId: string): Container {
    const container = new Container()
    loadDefaultModules(container);
    container.load(yangDiagramModule);

    overrideViewerOptions(container, {
        needsClientLayout: true,
        needsServerLayout: true,
        baseDiv: widgetId
    })
    return container
}
