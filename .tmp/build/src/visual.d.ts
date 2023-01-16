import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import "./../style/visual.less";
export declare class Visual implements IVisual {
    private viewport;
    private target;
    private reactRoot;
    private uid_index;
    private pid_index;
    private name_index;
    private team_index;
    private detail_index;
    constructor(options: VisualConstructorOptions);
    createTree(root: any, data: any): any;
    update(options: VisualUpdateOptions): void;
    private clear;
}
