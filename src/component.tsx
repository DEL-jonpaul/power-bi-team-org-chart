import React, { Fragment, Component, useState, useEffect } from "react";
import blank_pf from './blank_profile.jpg';

let treeColor
let transparency = 1

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
  color: null,
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
    transparency = 1; //reset transparency
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
  // console.log("Tree Color: ", treeColor);
  console.log("color: ", treeColor);
  let levelColor = treeColor ? `rgba(${treeColor.r},${treeColor.g},${treeColor.b},${transparency})`: `rgb(0,255,0)`
  transparency *= 0.65
  // console.log(props.root);
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
          return (
            <Fragment key={item.id}>
              <li>
                <div className="card">
                  <div className="team-name"
                       style={{ background: levelColor}}
                       >
                    <h4>{item.team}</h4>
                  </div>
                  <Lead item={item}/>
                  <div className="card-body">
                    {item.members.map((each) => {
                      return <TeamMember item={each} />;
                    })}
                  </div>
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
      {item.principalName && <ProfilePicture id={item.principalName} />}
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

  // console.log('Token: ', props.token);
  // const key = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6ImtDTUxpczQxS2hzQ094MFQxbUY4ZmMwZDlSTDRpR05OeFduem9MdGNpOWsiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85Y2U3MDg2OS02MGRiLTQ0ZmQtYWJlOC1kMjc2NzA3N2ZjOGYvIiwiaWF0IjoxNjc0MjMzODI2LCJuYmYiOjE2NzQyMzM4MjYsImV4cCI6MTY3NDIzOTA2MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQTFuMzFORHkrRWJmOFduNFk1N2dRL0crQ1NUUk9hajlRaU1iSzJHSVdyQnZlaVdtS01aaTBCNnVNeFBWckl3aTdvV2Z6ejQyd2Zjb2Q0Zmt6TlRwOTB5bmNGdFBFSjAzbGRPVFk5QTlaZFBzPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiUGF1bCIsImdpdmVuX25hbWUiOiJKb25hdGhhbiIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjEwNC4xNzYuMjguOTQiLCJuYW1lIjoiUGF1bCwgSm9uYXRoYW4gKENEQy9ERElEL05DSVJEL09EKSAoQ1RSKSIsIm9pZCI6IjBjN2M5NGEwLTYzMjYtNDdiNy05ZjNiLTEwY2I1ZWQ3OTIzNiIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xMjA3NzgzNTUwLTIwNzUwMDA5MTAtOTIyNzA5NDU4LTg2Nzk0MiIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMThCMkZFMjQ4IiwicmgiOiIwLkFSZ0FhUWpubk50Z19VU3I2TkoyY0hmOGp3TUFBQUFBQUFBQXdBQUFBQUFBQUFBWUFHby4iLCJzY3AiOiJDYWxlbmRhcnMuUmVhZFdyaXRlIENoYXQuUmVhZCBDaGF0LlJlYWRCYXNpYyBDb250YWN0cy5SZWFkV3JpdGUgRGV2aWNlTWFuYWdlbWVudE1hbmFnZWREZXZpY2VzLlJlYWQuQWxsIERldmljZU1hbmFnZW1lbnRSQkFDLlJlYWQuQWxsIERldmljZU1hbmFnZW1lbnRTZXJ2aWNlQ29uZmlnLlJlYWQuQWxsIEZpbGVzLlJlYWRXcml0ZS5BbGwgR3JvdXAuUmVhZFdyaXRlLkFsbCBJZGVudGl0eVJpc2tFdmVudC5SZWFkLkFsbCBNYWlsLlJlYWQgTWFpbC5SZWFkV3JpdGUgTWFpbGJveFNldHRpbmdzLlJlYWRXcml0ZSBOb3Rlcy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBQZW9wbGUuUmVhZCBQbGFjZS5SZWFkIFByZXNlbmNlLlJlYWQgUHJlc2VuY2UuUmVhZC5BbGwgUHJpbnRlclNoYXJlLlJlYWRCYXNpYy5BbGwgUHJpbnRKb2IuQ3JlYXRlIFByaW50Sm9iLlJlYWRCYXNpYyBwcm9maWxlIFJlcG9ydHMuUmVhZC5BbGwgU2l0ZXMuUmVhZFdyaXRlLkFsbCBUYXNrcy5SZWFkV3JpdGUgVXNlci5SZWFkIFVzZXIuUmVhZEJhc2ljLkFsbCBVc2VyLlJlYWRXcml0ZSBVc2VyLlJlYWRXcml0ZS5BbGwgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJxdllNQ2YtaGpMVmxkc29MV2lRd1k4WkZrWjZ0N1JNZ2s5aVhSeTZYOWxZIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiOWNlNzA4NjktNjBkYi00NGZkLWFiZTgtZDI3NjcwNzdmYzhmIiwidW5pcXVlX25hbWUiOiJzbHU0QGNkYy5nb3YiLCJ1cG4iOiJzbHU0QGNkYy5nb3YiLCJ1dGkiOiJRWkdnOC1ua2lrZWpmNjl3YlZYQkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6IlNGRHBsUDEyREhOTnlzT0J6aWRFTVRwWW4tYzBSN1IwM1hnNk1VQUlxV0UifSwieG1zX3RjZHQiOjE0NDEwNDg4OTF9.Phl7h4Kd0d0MbXc9dSrGxumPZlGJBHej6oP_mnnukp-XWP_nlgsoaKNdpcVUpL0KZVLbUJ9rGwizjmyRTgb_L8CduWQJoL20znEedk1fcBbnkT5MeIMms9-a8YO5sKo4GdAJ2CCiNLeWRsfn6N4D1i9CedQwy8yFX1rqLhulJq8-eUuCgLJgntI5Js6QW8QymPGewYHfC8d6wNrNNeOcXvR4NFnOtinxtY1xpF7LOi0c9AE0sxJ-cZyT0nUT3l1urMFTfkPB8_-IlNJRKYPXsq8JwKQF6EZ1iqkZAe3stw7JIpNgporh9C6IDEVgFbTzwxVyk-4fqcxJ5furaBgFgg'
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
  const url = `https://delve-gcc.office.com/mt/v3/people/profileimage?userId=${props.id}%40cdc.gov&size=L`
  return <img src={url} onError={({ currentTarget }) => {
    currentTarget.onerror = null; // prevents looping
    currentTarget.src= blank_pf;
  }}></img>
  
}

