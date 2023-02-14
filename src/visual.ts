/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";
import powerbi from "powerbi-visuals-api";
import { VisualSettings } from "./settings";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import DataView = powerbi.DataView;
import DataViewTable = powerbi.DataViewTable;
import IViewport = powerbi.IViewport;

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactCircleCard, initialState } from "./component";    

import "./../style/visual.less";

export class Visual implements IVisual {
    private viewport: IViewport;
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private uid_index;
    private pid_index;
    private name_index;
    private team_index;
    private detail_index;
    private principalName_index;
    
    private visualSettings: VisualSettings;
    private formattingSettingsService: FormattingSettingsService;
    
    constructor(options: VisualConstructorOptions) {
        console.clear();
        this.formattingSettingsService = new FormattingSettingsService();
        this.reactRoot = React.createElement(ReactCircleCard, {});
        this.target = options.element;
        
        // console.log("id: ", options.host.instanceId);
        // this.token = options.host.authenticationService.getAADToken(options.host.instanceId)
        //     .then(token => console.log("promised token", token))
        //     .catch(error => console.error(error))
        //     .finally(() => console.log("DONE"));
        // console.log("token constructor", this.token);

        ReactDOM.render(this.reactRoot, this.target);
    }
    
    public createTree(root, data) {
        
        //set the children of the root to be each that has the parent id equal to root's unique id
        root.children = data.filter(each => each.pid === root.id && each.team !== root.team)
        
        data = data.filter(each => !root.children.includes(each))
        root.children.forEach(child => this.createTree(child, data))
        root.members = data.filter(each => each.team === root.team).sort((a, b) => a.name > b.name ? 1: -1)
        return root;
    }
    
    
    
    public update(options: VisualUpdateOptions) {
        if(options.dataViews && options.dataViews[0]){
            
            this.visualSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualSettings, options.dataViews);
            let color = hexToRgb(this.visualSettings.circle.circleColor.value.value)
            console.log("color visual.ts: ", color);
            const dataView: DataView = options.dataViews[0];
            const table: DataViewTable = dataView.table;
            const data = table.rows

            this.pid_index = table.columns.findIndex(
                (each) => each.roles.pid?.valueOf
            );
        
            this.uid_index = table.columns.findIndex(
                (each) => each.roles.uid?.valueOf
            );
            
            this.team_index = table.columns.findIndex(
                (each) => each.roles.team?.valueOf
            );

            this.name_index = table.columns.findIndex(
                (each) => each.roles.name?.valueOf
            );

            this.detail_index = table.columns.findIndex(
                (each) => each.roles.details?.valueOf
            )

            this.principalName_index = table.columns.findIndex(
                (each) => each.roles.principalName?.valueOf
            )

            //console.clear()
        
            let parsedData = data.map(e => {
                return {
                    id: e[this.uid_index],
                    pid: e[this.pid_index],
                    name: e[this.name_index],
                    team: e[this.team_index],
                    principalName: e[this.principalName_index],
                    details: e.slice(this.detail_index),
                    children: [],
                }
            })

            const parents = parsedData.filter(e => e.pid === "" || e.pid === null)
            const multipleParents = parents.length > 1
            const root = parents[0]

            //remove root from data
            parsedData = parsedData.filter(e => e.id !== root.id)
            
            //populate the tree - each entry has members (people on the same team) and children
            const tree = this.createTree(root, parsedData)
            // console.log("tree: ", JSON.parse(JSON.stringify(tree)));
            this.viewport = options.viewport;

            ReactCircleCard.update({
                root: tree,
                size: this.viewport,
                multipleParents: multipleParents,
                color: color
            });
        } else {
            this.clear();
        }
    }

    private clear() {
        ReactCircleCard.update(initialState);
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.visualSettings);
    }
}

function hexToRgb(hex) {
    console.log("hex: ", hex);
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }