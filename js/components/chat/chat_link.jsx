import React from "react";
import Loader from "./loader";
import OG from "./og";
import Dropbox from "./dropbox";

export default class ChatLink extends React.Component {

  render() {
    let Component;
    let cnt;
    if(typeof(this.props.link) === 'string') {
      cnt = (
        <div className="b-chat-link--loader">
          <Loader />
        </div>
      );
    } else {
      switch(this.props.link.type) {
        case "dropbox.com":
          Component = Dropbox;
          break
        default:
          Component = OG;
          break
      }
      cnt = <div className="b-chat-link--content"><Component params={this.props.link}/></div>;

    }
    return (
      <div className="b-chat-link">
        {cnt}
      </div>
    );
  }

}
