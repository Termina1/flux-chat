import React from "react";
import Button from "../button";
import {flux} from "../../decorators";
import throttle from "lodash.throttle";

@flux('user')
export default class ChatWindow extends React.Component {

  sendMessage() {
    let node = this.refs.message.getDOMNode();
    let text = node.value;
    if(text) {
      let id = Date.now() + Math.round(Math.random() * 100);
      let chat = this.context.flux.getActions('chat');
      let {link, textParsed} = this.props.parser.parseLinks(text);
      let result = chat.sentMessage(this.props.token, {
          tid: id,
          id,
          link: link,
          text,
          textParsed,
          date: Math.round(Date.now()/1000),
          from: this.props.user,
          out: 1
        }, this.props.companion);
      result.p.then((rid) => {
        chat.hadRealId(id, rid, this.props.companion);
        if(link) {
          chat.followed(link, rid);
        }
      });
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

  sendStatusUpdate() {
    this.context.flux.getActions('chat')
      .startedTyping(this.props.companion, this.props.token);
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
          <textarea onKeyPress={throttle(this.sendStatusUpdate.bind(this), 9000, {
            trailing: false
          })} onKeyDown={this.checkKey.bind(this)}
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
