import React from "react";
import Loader from "./loader";
import OG from "./og";
import ChatImage from "./chat_image";
import ChatEmbed from "./chat_embed";

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
        case "instagram.com":
          Component = ChatImage;
          break
        case "youtube.com":
          Component = ChatEmbed;
          break;

        default:
          Component = OG;
          break
      }
      cnt = <div className="b-chat-link--content">
        <Component onUpdate={this.props.onUpdate} params={this.props.link}/>
      </div>;

    }
    return (
      <div className="b-chat-link">
        {cnt}
      </div>
    );
  }

}
