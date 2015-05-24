import React from "react";
import {ALLOWED_IDS} from "../../constants";
import {flux} from "../../decorators";
import Loader from "./loader";
import EmptyChat from "./empty_chat";
import Message from "./message";
import Status from "./status";
import ChatWindow from "./chat_window";

@flux('chat')
export default class Chat extends React.Component {

  componentDidMount() {
    let actions = this.context.flux.getActions('chat');
    let id = ALLOWED_IDS.filter(el => el !== this.props.user)[0];
    actions.startedChat({userId: id, token: this.props.token});
  }

  getMessages(chat) {
    if(chat.messages.length === 0) {
      return <EmptyChat />;
    }
    return chat.messages.map(el => <Message message={el} />);
  }

  render() {
    let content;
    let id = this.state.currentChat;
    let chat = this.state.chats[id];
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
          <div className="b-chat-container--wrap">
            <div className="b-chat-container--wrap-inner">
              {content}
              <Status chat={chat} />
            </div>
          </div>
        </div>
        <ChatWindow user={this.props.user} companion={id}
          parser={this.props.parser} />

      </div>
    );
  }

}
