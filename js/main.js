import React from "react";
import {} from "babel/polyfill";
import {} from "whatwg-fetch";

import Start from "./components/start";
import VKAuth from "./services/vk";
import App from "./flux/app";
import LinkParser from "./services/links";
import Follower from "./services/follower";
import Replayer from "./services/replayer";
import Connector from "./services/connector";

let elem = document.querySelector('.js-chat');
let service = new VKAuth();
let follower = new Follower();
let parser = new LinkParser();
let connector = new Connector(service, parser);
let app = new App(service, follower, connector, parser);
let replayer = new Replayer(app, { auth: ['entered'], chat: ['followed'] });
replayer.replay('auth', 'entered');

var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent)

React.render(React.createElement(Start, {
  authService: service,
  flux: app,
  parser,
  replayer
}), elem);
