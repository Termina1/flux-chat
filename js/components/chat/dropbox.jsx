import React from "react";

export default class Dropbox extends React.Component {

  render() {
    let og = this.props.params;
    return (
      <div className="b-chat-image">
        <img src={this.props.params.image} alt="" />
      </div>
    );
  }

}
