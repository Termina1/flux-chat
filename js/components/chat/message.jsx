import React from "react";
import ChatLink from "./chat_link";

export default class Message extends React.Component {

  render() {
    let profileLink = `https://vk.com/id${this.props.message.from}`;
    let messageLink;
    if(this.props.message.link) {
      messageLink = <ChatLink link={this.props.message.link} />
    }
    let user = this.props.user || {};
    return (
      <div className="b-message">
        <a href={profileLink} className="b-message--photo">
          <img src={user.photo_100} />
        </a>
        <div className="b-message--info">
          <a className="b-message--name" href={profileLink}>{user.first_name}</a>
          <div className="b-message--text" dangerouslySetInnerHTML={{__html: this.props.message.textParsed}}></div>
        </div>
        {messageLink}
      </div>
    );
  }

}
