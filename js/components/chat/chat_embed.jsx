import React from "react";
import Loader from "./loader";

export default class ChatEmbed extends React.Component {

  render() {
    let snippet = this.props.params.snippet;
    return (
      <div dangerouslySetInnerHTML={{__html: snippet}}>
      </div>
    );
  }

}
