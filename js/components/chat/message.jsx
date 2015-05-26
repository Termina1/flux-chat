import React from "react";
import ChatLink from "./chat_link";

function z(num) {
  if(num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
}

export default class Message extends React.Component {

  getJustDate(d) {
    return `${z(d.getDate())}.${z(d.getMonth())}.${d.getFullYear()}`;
  }

  getTime(d) {
    return `${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`;
  }

  getDate() {
    let date = new Date(this.props.message.date * 1000);
    let jdate = this.getJustDate(date);
    if(jdate === this.getJustDate(new Date())) {
      return this.getTime(date);
    } else {
      return jdate;
    }
  }

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
          <div className="b-message--date">{this.getDate()}</div>
          <a className="b-message--name" href={profileLink}>{user.first_name}</a>
          <div className="b-message--text" dangerouslySetInnerHTML={{__html: this.props.message.textParsed}}></div>
        </div>
        {messageLink}
      </div>
    );
  }

}
