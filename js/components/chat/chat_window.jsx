import React from "react";
import Button from "../button";
import {flux} from "../../decorators";

@flux('user')
export default class ChatWindow extends React.Component {

  sendMessage() {
    let node = this.refs.message.getDOMNode();
    let text = node.value;
    if(text) {
      let id = Date.now() + Math.round(Math.random() * 100);
      let chat = this.context.flux.getActions('chat');
      let {link, textParsed} = this.props.parser.parseLinks(text);
      chat.sentMessage(this.props.token, {
          id,
          link: link,
          text,
          textParsed,
          from: this.props.user,
          out: 1
        }, this.props.companion);
      if(link) {
        chat.followed(link, id);
      }
    }
    node.value = "";
  }

  checkKey(ev) {
    if(ev.which === 13 && (ev.ctrlKey || ev.metaKey)) {
      this.sendMessage();
    }
  }

  getImage(id) {
    if(!this.state.users[id]) {
      return "";
    }
    return this.state.users[id].photo_100;
  }

  getLink(id) {
    return `https://vk.com/id${id}`;
  }

  render() {
    return (
      <div className="b-chat-window">
        <div className="b-chat-window--photo">
          <a target="_blank" href={this.getLink(this.props.user)}>
            <img src={this.getImage(this.props.user)} />
          </a>
        </div>
        <div className="b-chat-window--inputs">
          <textarea onKeyDown={this.checkKey.bind(this)}
            ref="message" placeholder="Введите Ваше сообщение..."
             className="b-chat-window--inputs-textarea"></textarea>
          <div className="b-chat-window--send">
            <Button onClick={this.sendMessage.bind(this)}>Отправить</Button>
          </div>
        </div>
        <div className="b-chat-window--photo">
          <a target="_blank" href={this.getLink(this.props.companion)}>
            <img src={this.getImage(this.props.companion)} />
          </a>
        </div>
      </div>
    );
  }

}
