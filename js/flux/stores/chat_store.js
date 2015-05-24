import {Store} from "flummox";

export default class ChatStore extends Store {

  constructor(flux) {
    super();

    const chat = flux.getActionIds('chat');
    this.registerAsync(chat.startedChat,
        this.startChat, this.addMessages, this.failed);

    this.register(chat.sentMessage, this.addMessages);

    this.registerAsync(chat.followed, false, this.embedLink);
    this.state = { chats: {}, currentChat: null };
  }

  embedLink({id, result}) {
    let chat = this.state.currentChat;
    let message = this.state.chats[chat].messages.filter(el => el.id === id);
    if(message) {
      message[0].link = result;
      this.emit('change');
    }
  }

  failed({params, error}) {
    this.setState({
      currentChat: params.userId,
      chats: {
        [params.userId]: {
          loading: false,
          messages: this.state.chats[params.userId].messages
        }
      }
    });
  }

  startChat(args) {
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
