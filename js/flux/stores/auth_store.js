import {Store} from "flummox";

export default class AuthStore extends Store {

  constructor(flux) {
    super();

    const auth = flux.getActionIds('auth');
    this.registerAsync(auth.entered, undefined, this.setAuth)
    this.state = { authedId: null };
  }

  setAuth(data) {
    let {token, user} = data;
    this.setState({
      token,
      authedId: user.uid
    });
  }

}
