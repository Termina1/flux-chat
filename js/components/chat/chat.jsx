import React from "react";
import {ALLOWED_IDS} from "../../constants";
import {flux} from "../../decorators";
import Loader from "./loader";
import EmptyChat from "./empty_chat";
import Message from "./message";
import Status from "./status";
import ChatWindow from "./chat_window";

@flux({
  chat(store) {
    return {chat: store.state};
  },
  user(store) {
    return {users: store.state.users};
  }
})
export default class Chat extends React.Component {

  componentDidUpdate() {
    let node = this.refs.window.getDOMNode();
    node.scrollTop = node.scrollHeight;
  }

  componentDidMount() {
    let actions = this.context.flux.getActions('chat');
    let id = ALLOWED_IDS.filter(el => el !== this.props.user)[0];
    setTimeout(() => {
      actions.startedChat({userId: id, token: this.props.token});
    }, 100);
  }

  getMessages(chat) {
    if(chat.messages.length === 0) {
      return <EmptyChat />;
    }
    return chat.messages.map(el => {
      return <Message key={el.id} user={this.state.users[el.from]} message={el} />
    });
  }

  render() {
    let content;
    let id = this.state.chat.currentChat;
    let chat = this.state.chat.chats[id];
    if(chat && !chat.loading) {
      content = this.getMessages(chat);
    } else {
      content = <Loader />;
    }
    return (
      <div>
        <div className="b-chat-head">
          <div className="b-chat-head--actions"></div>
          <div className="b-chat-head--dialogs">
            <div className="b-dialog">Беседа</div>
          </div>
        </div>
        <div className="b-chat-container">
          <div className="b-chat-container--wrap" ref="window">
            <div className="b-chat-container--wrap-inner">
              {content}
              <Status chat={chat} />
            </div>
          </div>
        </div>
        <ChatWindow user={this.props.user} companion={id}
          token={this.props.token}
          parser={this.props.parser} />

      </div>
    );
  }

}
