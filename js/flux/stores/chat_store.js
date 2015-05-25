import {Store} from "flummox";

export default class ChatStore extends Store {

  constructor(flux, connector) {
    super();

    this.connector = connector;

    const chat = flux.getActionIds('chat');
    this.registerAsync(chat.startedChat,
        this.startChat, this.addMessages, this.failed);

    this.register(chat.sentMessage, this.addMessages);
    this.flux = flux;
    this.registerAsync(chat.followed, false, this.embedLink);
    this.registerAsync(chat.loadHistory, this.loadingOnTop, this.addPrevMessages);

    this.state = { chats: {}, currentChat: null };
  }

  addPrevMessages({messages, userId}) {
    this.state.chats[userId] = {
      messages: messages.concat(this.state.chats[userId].messages)
    };
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

  updateChatStatus(u) {}

  fromPoll(type, u) {
    switch(type) {
      case 'status':
        this.updateChatStatus(u);
        break;

      case 'message':
        if(u.userId === this.state.currentChat) {
          this.addMessages(u);
        }
        break;
    }
  }

  connectToServer(token) {
    if(!this.connector.isConnected()) {
      this.connector.connect(token, this.flux, this.fromPoll.bind(this));
    }
  }

  startChat(args) {
    this.connectToServer(args.actionArgs[0].token);
    let userId = args.actionArgs[0].userId;
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
