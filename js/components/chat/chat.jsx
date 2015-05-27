import React from "react";
import {ALLOWED_IDS} from "../../constants";
import {flux} from "../../decorators";
import Loader from "./loader";
import EmptyChat from "./empty_chat";
import Message from "./message";
import Status from "./status";
import ChatWindow from "./chat_window";
import throttle from "lodash.throttle";

const HEIGHT_TO_GO_BOTTOM = 100;

@flux({
  chat(store) {
    return {chat: store.state};
  },
  user(store) {
    return {users: store.state.users};
  }
})
export default class Chat extends React.Component {

  componentDidUpdate(prevProps, prevState) {
    this.applyPosition();
  }

  applyPosition() {
    let node = this.refs.window.getDOMNode();
    let height = node.getBoundingClientRect().height;
    if(node.scrollTop + height + HEIGHT_TO_GO_BOTTOM > node.scrollHeight) {
      node.scrollTop = node.scrollHeight;
    } else {
      let pscroll = this.prevScroll || 0;
      node.scrollTop = node.scrollHeight - pscroll;
    }
  }

  getMessagesModels() {
    return this.state.chat.chats[this.state.chat.currentChat].messages;
  }

  checkForLoad(ev) {
    let chat = this.state.chat.chats[this.state.chat.currentChat];
    if(chat.all) {
      return;
    }
    let node = this.refs.window.getDOMNode();
    this.prevScroll = node.scrollHeight - node.scrollTop;
    if(node.scrollTop < 100 && !this.context.flux.dispatcher.isDispatching()) {
      this.prevScroll = node.scrollHeight;
      this.context.flux.getActions('chat')
        .loadHistory(chat,
          this.state.chat.currentChat, this.props.token);
    }
  }

  componentDidMount() {
    let actions = this.context.flux.getActions('chat');
    let id = ALLOWED_IDS.filter(el => el !== this.props.user)[0];
    setTimeout(() => {
      actions.startedChat({userId: id, token: this.props.token})
        .then(() => {
          this.props.replayer.replay('chat', 'followed');
        });
    }, 100);
  }

  getMessages(chat) {
    if(chat.messages.length === 0) {
      return <EmptyChat />;
    }
    return chat.messages.map(el => {
      return <Message key={el.id} onUpdate={this.applyPosition.bind(this)}
        user={this.state.users[el.from]} message={el} />;
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
    let top;
    if(chat && chat.loadingTop) {
      top = <Loader />;
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
          <div className="b-chat-container--wrap" ref="window" onScroll={throttle(this.checkForLoad.bind(this), 200, {
            leading: false,
            trailing: true
          })}>
            <div className="b-chat-container--wrap-inner">
              {top}
              {content}
              <Status chat={chat} users={this.state.users} />
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
