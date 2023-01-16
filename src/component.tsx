import React, { Fragment, Component, useState, useEffect } from "react";

export interface State {
    root: object,
    size: object,
}

export const initialState: State = {
    root: null,
    size: {width: 1280, height: 720, scale: 1},
}

let applyScaling = (size) => {
  let parent = Array.from(document.getElementsByClassName('org-tree') as HTMLCollectionOf<HTMLElement>)[0]
  // let parent = document.querySelector('ul')
  let ww = size.width
  let wh = size.height
  let cw = parent.clientWidth;
  let ch = parent.clientHeight;
  
  let scaleAmtX = Math.min(ww / cw, wh / ch);
  let scaleAmtY = scaleAmtX;
  parent.style.transformOrigin = "0% 0%"
  let dx = (size.width - cw*scaleAmtX)/2
  parent.style.transform = `scale(${scaleAmtX}, ${scaleAmtY}) translateX(${dx/scaleAmtX}px)`
  
  console.table({wrapperWidth: ww, wrapperHeight: wh, contentWidth: cw, contentHeight: ch, width: cw*scaleAmtX, height: ch*scaleAmtY, widthDifference: ww - cw*scaleAmtX, translate: dx})
  
};

export class ReactCircleCard extends Component<{}, State>{
    constructor(props: any){
        super(props);
        this.state = initialState;
    }

    private static updateCallback: (data: object) => void = null;

    public static update(newState: State) {
        if(typeof ReactCircleCard.updateCallback === 'function'){
            ReactCircleCard.updateCallback(newState);
        }
    
      }
      
    public state: State = initialState;
      
    public componentDidUpdate()  {
        applyScaling(this.state.size)
  
    }
    
    public componentDidMount() {
        ReactCircleCard.updateCallback = (newState: State): void => { this.setState(newState); };
    }
    
    public componentWillUnmount() {
        ReactCircleCard.updateCallback = null;
    }


    render(){
        return (
            <div className="org-tree" >
                <Card root={this.state.root ? [this.state.root]: null}/>
            </div>

          );
    }
}

const Card = (props) => {
  // const levelColor = randomcolor();
  // console.log(props.root);
  if (props.root === null || props.root.length === 0) {
    return <h1> No data (yet) </h1>;
  } else {
    return (
      <ul> {
        
          props.root.map((item) => {
          return <Fragment key={item.id}>
            <li>
              <div className="card">
                <div className="team-name">
                  <h4>{item.team}</h4>
                </div>
                <Lead item={item} />
                <div className="card-body">
                {item.members.map( (each) => {
                    return <TeamMember item={each} />;
                  })}
                </div>
                <div
                  className="card-footer"
                  // style={{ background: levelColor }}
                ></div>
                <div></div>
              </div>
              {item.children?.length !== 0 && <Card root={item.children} />}
            </li>
          </Fragment>
          })
        }</ul>
    );
  }
};

function Lead(props) {

    const item = props.item;
    return (
      <div className="lead">
      
          <h4 className="name">{item.name}</h4>
          {item.details.map(detail => <p>{detail}</p>)}

      </div>
    );
  };

  const TeamMember = (props) => {
    const item = props.item;
    return (
        <div className="person">
          <p className="name">
            <b>{item.name === "" ? "***NO NAME***" : item.name}</b>
          </p>
          {item.details.map(detail => <p>{detail}</p>)}
      </div>
    );
  };

  