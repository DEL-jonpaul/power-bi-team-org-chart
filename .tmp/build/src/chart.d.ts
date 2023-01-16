import { Component } from "react";
export interface State {
    textLabel: string;
    data: object;
}
export declare const initialState: State;
export declare class Chart extends Component<any, any> {
    constructor(props: any);
    private static updateCallback;
    static update(newState: State): void;
    state: State;
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
