import React from "react";
import ChatLink from "./chat_link";

export default class Message extends React.Component {

  render() {
    let profileLink = `https://vk.com/id${this.props.message.from}`;
    let messageLink;
    if(this.props.message.link) {
      messageLink = <ChatLink link={this.props.message.link} />
    }
    return (
      <div className="b-message">
        <a href={profileLink} className="b-message--photo">
          <img src="https://pp.vk.me/c412825/v412825216/5ed8/oen8E5j_dJc.jpg" />
        </a>
        <div className="b-message--info">
          <a className="b-message--name" href={profileLink}>Вячеслав</a>
          <div className="b-message--text" dangerouslySetInnerHTML={{__html: this.props.message.text}}></div>
        </div>
        {messageLink}
      </div>
    );
  }

}
