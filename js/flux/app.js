import {Flummox} from "flummox";
import AuthActions from "./actions/auth_actions";
import ChatActions from "./actions/chat_actions";

import AuthStore from "./stores/auth_store";
import ChatStore from "./stores/chat_store";
import UserStore from "./stores/user_store";

export default class App  extends Flummox {

  constructor(service, follower, connector, parser) {
    super();
    this.createActions('auth', AuthActions, service);
    this.createActions('chat', ChatActions, service, follower, parser);

    this.createStore('auth', AuthStore, this);
    this.createStore('chat', ChatStore, this, connector);
    this.createStore('user', UserStore, this);
  }

}
