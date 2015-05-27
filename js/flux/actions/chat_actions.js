import {Actions} from "flummox";

export default class ChatActions extends Actions {

  constructor(service, follower, parser) {
    super();
    this.service = service;
    this.follower = follower;
    this.parser = parser;
  }

  processVkMessages(messages) {
    return messages.items
      .map(el => ({ textParsed: this.parser.parseLinks(el.body).textParsed,
        text: el.body,
        from: el.from_id,
        date: el.date,
        attachments: el.attachments,
        id: el.id,
        out: el.out
      })).reverse();
  }

  startedTyping(userId, token) {
    this.service.api('messages.setActivity', token, {
      user_id: userId,
      type: "typing"
    });
    return userId;
  }

  async loadHistory(chat, userId, token) {
    let messages = await this.service
      .loadMoreMessages(token, chat.messages[0].id, userId);
    messages = this.processVkMessages(messages);
    return {userId, messages};

  }

  async startedChat({token, userId}) {
    let messagesPromise = this.service.api('messages.getHistory', token,
      { user_id: userId });
    let companionPromise = this.service.getUser(token, userId);
    let [messages, companion] = await Promise.all([messagesPromise, companionPromise]);
    let user = companion[0];
    messages = this.processVkMessages(messages);
    return { userId, messages, user };
  }

  async followed(link, id) {
    let result = await this.follower.follow(link);
    return {link, result, id};
  }

  sentMessage(token, message, userId) {
    this.service.sendMessage(token, message, userId);
    return {userId, messages: [message] };
  }

}
