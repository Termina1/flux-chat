import {Actions} from "flummox";

export default class ChatActions extends Actions {

  constructor(service, follower) {
    super();
    this.service = service;
    this.follower = follower;
  }

  async startedChat({token, userId}) {
    let history = await this.service.api('messages.getHistory', token, {userId});
    return { userId, history };
  }

  async followed(link, id) {
    let result = await this.follower.follow(link);
    return {link, result, id};
  }

  sentMessage(message, userId) {
    return {userId, messages: [message] };
  }

}
