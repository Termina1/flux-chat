import {SERVER} from "../constants";

export default class Connector {

  constructor(service, parser) {
    this.service = service;
    this.parser = parser;
  }

  connect(token, flux, callback) {
    this.callback = callback;
    this.flux = flux;
    return this.service.api("messages.getLongPollServer", token)
      .then(({server, key, ts}) => {
        let url = `http://${server}?act=a_check&key=${key}&wait=25&mode=2&ts=`;
        this.startLoop(url, ts)
      });
  }

  addMessageFromPoll(u) {
    let [s, id, flags, fromId, date, su, text, attach] = u;
    if(!(flags & 2)) {
      let {link, textParsed} = this.parser.parseLinks(text);
      if(link) {
        this.flux.getActions('chat').followed(link, id);
      }
      let message = {
        text,
        textParsed,
        date,
        id,
        link: link,
        from: fromId,
        out: 0
      }
      this.callback('message', {userId: fromId, messages: [message]});
    }
  }


  streamFromPoll({updates}) {
    let relevant = updates.filter(u => [4, 61].includes(u[0])).forEach(u => {
      switch(u[0]) {
        case 61:
          this.callback('status', u)
          break;

        case 4:
          this.addMessageFromPoll(u);
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
