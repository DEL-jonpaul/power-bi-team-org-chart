import { tree } from "d3";
import React, { Fragment, Component, useState, useEffect } from "react";
import blank_pf from './blank_profile.jpg';

let treeColor
let opacity = 2
const luminance_black = 255
const luminance_white = 0
  

export interface State {
  root: object;
  size: object;
  multipleParents: boolean;
  color: object;
}

export const initialState: State = {
  root: null,
  size: { width: 1280, height: 720, scale: 1 },
  multipleParents: null,
  color: {r: 255, g: 255, b: 255},
};

// function to scale the chart to fit nicely in the viewport
let applyScaling = (size) => {
  let parent = Array.from(
    document.getElementsByClassName("org-tree") as HTMLCollectionOf<HTMLElement>
  )[0];
  // let parent = document.querySelector('ul')
  let ww = size.width;
  let wh = size.height;
  let cw = parent.clientWidth;
  let ch = parent.clientHeight;

  let scaleAmtX = Math.min(ww / cw, wh / ch);
  let scaleAmtY = scaleAmtX;
  parent.style.transformOrigin = "0% 0%";
  let dx = (size.width - cw * scaleAmtX) / 2;
  parent.style.transform = `scale(${scaleAmtX}, ${scaleAmtY}) translateX(${
    dx / scaleAmtX
  }px)`;

  // console.table({
  //   wrapperWidth: ww,
  //   wrapperHeight: wh,
  //   contentWidth: cw,
  //   contentHeight: ch,
  //   width: cw * scaleAmtX,
  //   height: ch * scaleAmtY,
  //   widthDifference: ww - cw * scaleAmtX,
  //   translate: dx,
  // });
};

export class ReactCircleCard extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = initialState;
    
  }
  
  private static updateCallback: (data: object) => void = null;
  
  public static update(newState: State) {
    if (typeof ReactCircleCard.updateCallback === "function") {
      ReactCircleCard.updateCallback(newState);
    }
  }
  
  public state: State = initialState;
  
  public componentDidUpdate() {
    applyScaling(this.state.size);
    opacity = 1; //reset opacity
  }
  
  public componentDidMount() {
    ReactCircleCard.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }
  
  public componentWillUnmount() {
    ReactCircleCard.updateCallback = null;
  }
  
  render() {
    treeColor = this.state.color
    return (
      <div className="org-tree">
        <Card
          root={this.state.root ? [this.state.root] : null}
          multipleParents={this.state.multipleParents}
        />
      </div>
    );
  }
}

const Card = (props) => {
  console.log(props.root);
  // let levelColor = (1-opacity)*treeColor - opacity*Object({
  // r: 255, g: 255, b: 255})
  
  let levelColor = `rgba(${treeColor.r},${treeColor.g},${treeColor.b},${opacity})`
  
  let luminance = 0.299*treeColor.g + 0.587*treeColor.g + 0.114*treeColor.b
  let contrast_black = opacity*Math.abs(luminance - luminance_black)/luminance;
  opacity *= 0.5
  // let contrast_white = Math.abs(luminance - luminance_white)/luminance;
  // console.log({luminance});
  // console.log({contrast_black});
  // console.log({opacity});
  // console.log({adjusted: contrast_black * opacity});

  if (props.multipleParents) {
    return (
      <h1>
        Multiple parents detected, ensure data has only one entry with a null
        Parent ID or has been filtered to achieve such a case.
      </h1>
    );
  } else if (props.root === null || props.root.length === 0) {
    return <h1> No data (yet) </h1>;
  } else {
    return (
      <ul>
        {" "}
        {props.root.map((item) => {
          console.log({item});
          return (
            <Fragment key={item.id}>
              <li>
                <div className="card">
                  <div className="team-name"
                       style={{ background: levelColor, color: contrast_black < 1 ?  "black":"white" }}
                       >
                    <h4>{item.team}</h4>
                  </div>
                  <table>
                    <tr>
                      <th>
                        Name
                      </th>
                      {Object.keys(item.details).map((key) => <th>{key}</th>)}
                    </tr>
                    <tr>
                      <td className="lead"><h4>{item.name}</h4></td>
                      {Object.values(item.details).map((detail: String) => <td className="lead">{detail}</td>)}
                    </tr>
                      
                      {item.members.map((each) => {
                        // return <TeamMember item={each} />;
                        return <tr>
                                  <td>{each.name === "" ? "***NO NAME***" : each.name}</td>
                                  {Object.values(each.details).map((detail: String) => (<td>{detail}</td>))}
                              
                                </tr>
                      })}
                    </table>
                  
                  <div
                    className="card-footer"
                    style={{ background: levelColor }}
                  ></div>
                  <div></div>
                </div>
                {item.children?.length !== 0 && <Card root={item.children} />}
              </li>
            </Fragment>
          );
        })}
      </ul>
    );
  }
};

function Lead(props) {
  const item = props.item;
  // console.log("Lead: ", item.principalName);
  return (
    <div className="lead">
      {/* {item.principalName && <ProfilePicture id={item.principalName} />} */}
      <h4 className="name">{item.name}</h4>
      <div className="details">
        {item.details.map((detail) => (
          <p>{detail}</p>
        ))}
      </div>
    </div>
  );
}

const TeamMember = (props) => {
  const item = props.item;
  return (
    <>
      <div className="person">
        <p className="name">
          <b>{item.name === "" ? "***NO NAME***" : item.name}</b>
        </p>
        <div className="details">
          {item.details.map((detail) => (
            <p>{detail}</p>
          ))}
        </div>
      </div>
    </>
  );
};

const ProfilePicture = (props) => {

  // const key = ''
  // const url = `https://graph.microsoft.com/v1.0/users/${props.id}@cdc.gov/photo/$value`
  
  // const [imgURL, setURL] = React.useState('')

  // // React.useEffect(() =>
  // //   {      
  //     fetch(url, {
  //         headers: {
  //             Authorization: `Bearer ${key}`
  //         }
  //     }).then(e => e.blob().then(blob => {
  //         console.log(blob);
  //         setURL(URL.createObjectURL(blob))
  //     }))
  // //   }
  // // )
  // return <img src={imgURL}></img>
  // console.log("img id: ", props.id);

  /////Using DELVE
  // const url = `https://delve-gcc.office.com/mt/v3/people/profileimage?userId=${props.id}%40cdc.gov&size=L`
  // return <img src={url} onError={({ currentTarget }) => {
  //   currentTarget.onerror = null; // prevents looping
  //   currentTarget.src= blank_pf;
  // }}></img>
  
}

