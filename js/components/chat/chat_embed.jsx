import React from "react";
import Loader from "./loader";

export default class ChatEmbed extends React.Component {

  render() {
    let snippet = this.props.params.snippet;
    return (
      <div className="b-chat-image" dangerouslySetInnerHTML={{__html: snippet}}>
      </div>
    );
  }

}
