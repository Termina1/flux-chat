import React from "react";
import Loader from "./loader";

const MAX_TRIES = 15;

export default class ChatImage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = { loaded: false };
  }

  tryReloading() {
    if(this.loads >= MAX_TRIES) {
      this.setState({
        error: "Не получается загрузить изображение",
        loaded: true
      });
    } else {
      let node = this.refs.img.getDOMNode();
      node.src = "";
      node.src = this.props.params.image + "&t=" + this.loads;
      this.loads++;
    }
  }

  componentDidMount() {
    this.loads = 0;
    this.tryReloading.bind(this);
  }

  loaded(e) {
    this.setState({loaded: true});
    console.log('updating');
    this.props.onUpdate();
  }

  render() {
    let og = this.props.params;
    let loader, cnt;
    if(!this.state.loaded) {
      loader = <Loader />;
    }
    if(!this.state.error) {
      cnt = <img ref="img" src={this.props.params.image}
        onError={this.tryReloading.bind(this)}
        onLoad={this.loaded.bind(this)} alt="" />;
    } else {
      cnt = <div className="b-error">{this.state.error}</div>;
    }
    return (
      <div className="b-chat-image">
        {loader}
        {cnt}
        <p className="b-chat-image--description">{this.props.params.description}</p>
      </div>
    );
  }

}
