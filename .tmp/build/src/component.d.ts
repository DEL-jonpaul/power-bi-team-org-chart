import { Component } from "react";
export interface State {
    root: object;
    size: object;
}
export declare const initialState: State;
export declare class ReactCircleCard extends Component<{}, State> {
    constructor(props: any);
    private static updateCallback;
    static update(newState: State): void;
    state: State;
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
