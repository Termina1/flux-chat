import React from "react";
import Loader from "./loader";

export default class ChatImage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = { loaded: false };
  }

  loaded(e) {
    this.setState({loaded: true});
  }

  render() {
    let og = this.props.params;
    let cnt;
    if(!this.state.loaded) {
      cnt = <Loader />;
    }
    return (
      <div className="b-chat-image">
        {cnt}
        <img src={this.props.params.image} onLoad={this.loaded.bind(this)} alt="" />
      </div>
    );
  }

}
