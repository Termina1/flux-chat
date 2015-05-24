import React from "react";
import Button from "../button";
import uuid from "uuid";

export default class ChatWindow extends React.Component {

  static contextTypes = {
    flux: React.PropTypes.object
  }

  sendMessage() {
    let node = this.refs.message.getDOMNode();
    let text = node.value;
    if(text) {
      let id = uuid.v1();
      let chat = this.context.flux.getActions('chat');
      let {link, textParsed} = this.props.parser.parseLinks(text);
      chat.sentMessage({
          id,
          link: link,
          text: textParsed,
          from: this.props.user,
          to: this.props.companion
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

  render() {
    return (
      <div className="b-chat-window">
        <div className="b-chat-window--photo">
          <img src="https://pp.vk.me/c412825/v412825216/5ed8/oen8E5j_dJc.jpg" />
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
          <img src="https://pp.vk.me/c412825/v412825216/5ed8/oen8E5j_dJc.jpg" />
        </div>
      </div>
    );
  }

}
