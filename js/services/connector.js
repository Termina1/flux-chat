import {SERVER} from "../constants";

export default class Connector {

  constructor(service, parser) {
    this.service = service;
    this.parser = parser;
  }

  connect(token, flux, chatId, callback) {
    this.callback = callback;
    this.chatId = chatId;
    this.flux = flux;
    return this.service.api("messages.getLongPollServer", token)
      .then(({server, key, ts}) => {
        let url = `http://${server}?act=a_check&key=${key}&wait=25&mode=2&ts=`;
        this.startLoop(url, ts)
      });
  }

  addMessageFromPoll(u) {
    let [s, id, flags, fromId, date, su, text, attach] = u;
    let {link, textParsed} = this.parser.parseLinks(text);
    if(link && !(flags & 2)) {
      this.flux.getActions('chat').followed(link, id);
    }
    let me = this.flux.getStore('auth').state.authedId;
    fromId = (flags & 2) ? me : fromId;
    let message = {
      text,
      textParsed,
      date,
      id,
      link: link,
      from: fromId,
      out: flags & 2
    }
    this.callback('message', {userId: this.chatId, message});
  }


  streamFromPoll({updates}) {
    console.log(updates);
    let relevant = updates.filter(u => [4, 61, 0, 2].includes(u[0])).forEach(u => {
      switch(u[0]) {
        case 61:
          if(u[1] === this.chatId) {
            this.callback('status', u);
          }
          break;

        case 0:
          this.callback('remove', u[1]);
          break;

        case 2:
          if(u[2] & 128) {
            this.callback('remove', u[1])
          }
          break;

        case 4:
          if(u[3] === this.chatId) {
            this.addMessageFromPoll(u);
          }
          break;
      }
    });
  }

  startLoop(server, ts) {
    fetch(SERVER + "/poll?server=" + encodeURIComponent(server + ts))
      .then(resp => resp.json())
      .then(r => {
        this.streamFromPoll(r);
        this.startLoop(server, r.ts);
      });
  }

  isConnected() {
    return !!this.connected;
  }

}
