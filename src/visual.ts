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

    constructor(options: VisualConstructorOptions) {
        this.reactRoot = React.createElement(ReactCircleCard, {});
        this.target = options.element;
        
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

            //console.clear()
            console.log("data: ", table);
        
            let parsedData = data.map(e => {
                return {
                    id: e[this.uid_index],
                    pid: e[this.pid_index],
                    name: e[this.name_index],
                    team: e[this.team_index],
                    details: e.slice(this.detail_index),
                    children: [],
                }
            })
            const root = parsedData.filter(e => e.pid === "" || e.pid === null)[0]

            //remove root from data
            parsedData = parsedData.filter(e => e.id !== root.id)
            const tree = this.createTree(root, parsedData)
            console.log("tree: ", JSON.parse(JSON.stringify(tree)));
            this.viewport = options.viewport;

            ReactCircleCard.update({
                root: tree,
                size: this.viewport
            });
        } else {
            this.clear();
        }
    }

    private clear() {
        ReactCircleCard.update(initialState);
    }
}