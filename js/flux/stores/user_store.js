import {Store} from "flummox";

export default class UserStore extends Store {

  constructor(flux) {
    super();

    const auth = flux.getActionIds('auth');
    this.registerAsync(auth.entered, undefined, this.addUser);

    const chat = flux.getActionIds('chat');
    this.registerAsync(chat.startedChat, undefined, this.addUser);
    this.state = { users: {} };
  }

  addUser({user}) {
    this.state.users[user.id] = user;
    this.emit('change');
  }

}
