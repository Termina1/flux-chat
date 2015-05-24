import React from "react";
import Button from "./button";

export default class Authorization extends React.Component {

  static contextTypes = {
    flux: React.PropTypes.object
  }

  constructor(props, context) {
    super(props, context);

    this.state = { startAuth: false };
  }

  auth() {
    this.props.authService.auth();
    this.setState({ startAuth: true });
  }

  enter() {
    let auth = this.context.flux.getActions('auth');
    let token = this.refs.token.getDOMNode().value;
    auth.entered(token);
  }

  render() {
    let content;

    if(!this.state.startAuth) {
      content = (
        <div className="b-auth">
          <Button onClick={this.auth.bind(this)}>Авторизоваться</Button>
        </div>
      );
    } else {
      content = (
        <div className="b-auth">
          <div className="b-auth--token">
            <input ref="token" type="text" />
          </div>
          <Button onClick={this.enter.bind(this)}>Войти</Button>
        </div>
      );
    }

    return content;
  }

}
