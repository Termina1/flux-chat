import React from "react";
import Start from "./components/start";
import VKAuth from "./services/vk";
import App from "./flux/app";
import LinkParser from "./services/links";
import Follower from "./services/follower";

let elem = document.querySelector('.js-chat');
let service = new VKAuth();
let follower = new Follower();
let app = new App(service, follower);

let parser = new LinkParser();

React.render(React.createElement(Start, {
  authService: service,
  flux: app,
  parser
}), elem);
