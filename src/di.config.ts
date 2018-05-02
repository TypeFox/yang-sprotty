/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { Container, ContainerModule } from "inversify";
import { ConsoleLogger, ExpandButtonHandler, ExpandButtonView, HtmlRoot,
        HtmlRootView, LogLevel, PolylineEdgeView, PreRenderedElement,
        PreRenderedView, SCompartment, SCompartmentView, SEdge, SGraph,
        SGraphView, SLabel, SLabelView, TYPES, boundsModule,
        buttonModule, configureModelElement, defaultModule, expandModule,
        exportModule, fadeModule, hoverModule, modelSourceModule, moveModule,
        openModule, overrideViewerOptions, selectModule, undoRedoModule,
        viewportModule, SButton } from 'sprotty/lib';
import { popupModelFactory } from "./popup";
import { ArrowEdgeView, CaseNodeView, ChoiceNodeView, ClassNodeView,
    CompositionEdgeView, DashedArrowEdgeView, DashedEdgeView, HeaderCompartmentView,
    ImportEdgeView, ModuleNodeView, NoteView, TagView, UsesNodeView } from "./views";
import { ModuleNode, Tag, YangLabel, YangNode } from "./yang-models";
import { YangModelFactory } from "./model-factory";

const yangDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope()
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn)
    rebind(TYPES.IModelFactory).to(YangModelFactory).inSingletonScope()
    bind(TYPES.PopupModelFactory).toConstantValue(popupModelFactory)
    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, 'graph', SGraph, SGraphView);
    configureModelElement(context, 'node:class', YangNode, ClassNodeView)
    configureModelElement(context, 'node:module', ModuleNode, ModuleNodeView)
    configureModelElement(context, 'node:choice', YangNode, ChoiceNodeView)
    configureModelElement(context, 'node:case', YangNode, CaseNodeView)
    configureModelElement(context, 'node:pill', YangNode, UsesNodeView)
    configureModelElement(context, 'node:note', YangNode, NoteView)
    configureModelElement(context, 'label:heading', SLabel, SLabelView)
    configureModelElement(context, 'label:text', SLabel, SLabelView)
    configureModelElement(context, 'ylabel:text', YangLabel, SLabelView)
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
    container.load(defaultModule, selectModule, moveModule, boundsModule, undoRedoModule, viewportModule,
        hoverModule, fadeModule, exportModule, expandModule, openModule, buttonModule, modelSourceModule,
        yangDiagramModule)
    //        container.bind(TYPES.ModelSource).to(TheiaDiagramServer).inSingletonScope()
    overrideViewerOptions(container, {
        needsClientLayout: true,
        needsServerLayout: true,
        baseDiv: widgetId
    })
    return container
}