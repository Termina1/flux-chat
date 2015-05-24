import {Store} from "flummox";

export default class AuthStore extends Store {

  constructor(flux) {
    super();

    const auth = flux.getActionIds('auth');
    this.register(auth.entered, this.setToken)
    if(localStorage.getItem('auth')) {
      this.state = JSON.parse(localStorage.getItem('auth'));
    } else {
      this.state = { authedId: null };
    }

    this.addListener('change', () => this.saveState());
  }

  saveState() {
    localStorage.setItem('auth', JSON.stringify(this.state));
  }

  setToken(token) {
    this.setState({
      token,
      authedId: 1
    });
    this.saveState();
  }

}
