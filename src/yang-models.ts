/*
 * Copyright (C) 2017-2020 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import {
    SLabel, SShapeElement, Expandable, RectangularNode, boundsFeature, fadeFeature,
    layoutContainerFeature, layoutableChildFeature
} from "sprotty"

export class YangNode extends RectangularNode {
    trace?: string;
    strokeWidth = 1;
}

export class ModuleNode extends YangNode implements Expandable {
    title: string;
    expanded = false;
}

export class YangLabel extends SLabel {
    trace?: string;
}

export class Tag extends SShapeElement {
    static readonly DEFAULT_FEATURES = [boundsFeature, layoutContainerFeature,  layoutableChildFeature, fadeFeature];

    size = {
        width: 24,
        height: 24
    };
}
