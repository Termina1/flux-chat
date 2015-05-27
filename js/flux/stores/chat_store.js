import {Store} from "flummox";
import assign from "object-assign";

export default class ChatStore extends Store {

  constructor(flux, connector) {
    super();

    this.connector = connector;

    const chat = flux.getActionIds('chat');
    this.registerAsync(chat.startedChat,
        this.startChat, this.addMessages, this.failed);

    this.register(chat.sentMessage, this.addMessages);
    this.register(chat.hadRealId, this.updateId);
    this.flux = flux;
    this.registerAsync(chat.followed, false, this.embedLink);
    this.registerAsync(chat.loadHistory, this.loadingOnTop, this.addPrevMessages);

    this.state = { chats: {}, currentChat: null };
  }

  updateId({id, rid, userId}) {
    let chat = this.state.chats[userId];
    chat.messages.filter(el => el.tid === id).forEach(el => {
      el.id = rid;
    });
    this.emit('change');
  }

  addPrevMessages({messages, userId}) {
    let chat = this.state.chats[userId];
    if(messages.length === 0) {
      chat.all = true;
      chat.loadingTop = false;
    } else {
      this.state.chats[userId] = {
        messages: messages.concat(this.state.chats[userId].messages)
      };
    }
    this.emit('change');
  }

  loadingOnTop(action) {
    let userId = action.actionArgs[1];
    this.state.chats[userId].loadingTop = true;
    this.emit('change');
  }

  embedLink({id, result}) {
    let chat = this.state.currentChat;
    let message = this.state.chats[chat].messages.filter(el => el.id === id);
    if(message) {
      message[0].link = result;
      this.emit('change');
    }
  }

  failed(errors) {
  }

  clearStatus(id) {
    this.state.chats[id].status = undefined;
    this.emit('change');
  }

  updateChatStatus(u) {
    this.state.chats[u[1]].status = u[1];
    this.emit('change');
    if(this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.clearStatus.bind(this, u[1]), 5000);
  }

  updateMessage(u) {
    let m = this.state.chats[u.userId].messages
      .filter(m => m.id === u.message.id);
    if(m.length > 0) {
      m.forEach(m => {
        assign(m, u.message);
      });
    } else {
      this.addMessages({userId: u.userId, messages: [u.message]});
    }
    this.emit('change');
  }

  fromPoll(type, u) {
    switch(type) {
      case 'status':
        this.updateChatStatus(u);
        break;

      case 'message':
        this.updateMessage(u);
        break;
    }
  }

  connectToServer(token, chat) {
    if(!this.connector.isConnected()) {
      this.connector.connect(token, this.flux,
        chat,
        this.fromPoll.bind(this));
    }
  }

  startChat(args) {
    let userId = args.actionArgs[0].userId;
    this.connectToServer(args.actionArgs[0].token, userId);
    this.setState({
      currentChat: userId,
      chats: {
        [userId]: {
          loading: true,
          messages: []
        }
      }
    });
  }

  addMessages({userId, messages}) {
    this.setState({
      currentChat: userId,
      chats: {
        [userId]: {
          messages: this.state.chats[userId].messages.concat(messages)
        }
      }
    });
  }

}
