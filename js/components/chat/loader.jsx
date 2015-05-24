import React from "react";
import Spinner from "react-spinkit";

export default class Loader extends React.Component {

  render() {
    return (
      <div className="b-loader">
        <Spinner spinnerName='three-bounce' noFadeIn/>
      </div>
    );
  }

}
