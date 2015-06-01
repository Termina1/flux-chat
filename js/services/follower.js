import {SERVER} from "../constants";

export default class Follower {

  follow(link) {
    link = link.trim();
    return fetch(`${SERVER}?link=${encodeURIComponent(link)}`)
      .then(resp => resp.json());
  }

}
