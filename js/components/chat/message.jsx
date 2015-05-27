import React from "react";
import ChatLink from "./chat_link";
import ChatImage from "./chat_image";

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
    let messageLink, items;
    if(this.props.message.link) {
      messageLink = <ChatLink link={this.props.message.link} onUpdate={this.props.onUpdate} />
    }
    if(this.props.message.attachments) {
      items = this.props.message.attachments.map(at => {
        switch(at.type) {
          case "photo":
            return <ChatImage params={{
              image: at[at.type].photo_604,
            }} onUpdate={this.props.onUpdate}/>;
          case "video":
            return <ChatImage params={{
              image: at[at.type].photo_800,
              description: at[at.type].title
            }} onUpdate={this.props.onUpdate}/>;
          default:
            return <div></div>;
        }
      });
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
          {items}
        </div>
        {messageLink}
      </div>
    );
  }

}
