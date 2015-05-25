import {Actions} from "flummox";

export default class AuthActions extends Actions {

  constructor(service) {
    super();
    this.service = service;
    this.state = { authedId: null };
  }

  async entered(token) {
    let resp = await this.service.getUser(token);
    return {token, user: resp[0]};
  }

}
