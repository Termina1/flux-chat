const KEY = "replayer";

export default class Replayer {
  constructor(flux, params) {
    this.params = params;
    this.flux = flux;
    flux.dispatcher.register(this.track.bind(this));
  }

  track(action) {
    Object.keys(this.params).forEach((store) => {
      let actions = this.flux.getActionIds(store);
      this.params[store]
        .filter(el => actions[el] === action.actionId)
        .forEach(this.save.bind(this, store, action))
    });
  }

  replay(store, action) {
    let actionId = this.flux.getActionIds(store)[action];
    let storage = this.getStorage();
    let dispatcher = this.flux.dispatcher;
    this.saveStorage(storage.map((el) => {
      if(el.actionId === actionId) {
        dispatcher.dispatch(el);
      }
      return el;
    }));
  }

  save(store, message) {
    let storage = this.getStorage();
    storage.push(message);
    this.saveStorage(storage);
  }

  clearStorge() {
    localStorage.setItem(KEY, "");
  }

  getStorage() {
    if(localStorage.getItem(KEY)) {
      return JSON.parse(localStorage.getItem(KEY));
    } else {
      return [];
    }
  }

  saveStorage(storage) {
    localStorage.setItem(KEY, JSON.stringify(storage));
  }
}
