import {Flummox} from "flummox";
import AuthActions from "./actions/auth_actions";
import ChatActions from "./actions/chat_actions";

import AuthStore from "./stores/auth_store";
import ChatStore from "./stores/chat_store";

export default class App  extends Flummox {

  constructor(service, follower) {
    super();
    this.createActions('auth', AuthActions);
    this.createActions('chat', ChatActions, service, follower);

    this.createStore('auth', AuthStore, this);
    this.createStore('chat', ChatStore, this);
  }

}
