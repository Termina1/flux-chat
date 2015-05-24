import {SERVER} from "../constants";

export default class Follower {

  follow(link) {
    return fetch(`${SERVER}?link=${encodeURIComponent(link)}`)
      .then(resp => resp.json());
  }


}
