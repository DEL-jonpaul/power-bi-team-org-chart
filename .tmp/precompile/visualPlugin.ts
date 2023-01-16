import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var orgchartBACC2BEC74244B22B53D3F1E69C0E08A_DEBUG: IVisualPlugin = {
    name: 'orgchartBACC2BEC74244B22B53D3F1E69C0E08A_DEBUG',
    displayName: 'orgchart_jonathanpaul',
    class: 'Visual',
    apiVersion: '5.1.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["orgchartBACC2BEC74244B22B53D3F1E69C0E08A_DEBUG"] = orgchartBACC2BEC74244B22B53D3F1E69C0E08A_DEBUG;
}
export default orgchartBACC2BEC74244B22B53D3F1E69C0E08A_DEBUG;