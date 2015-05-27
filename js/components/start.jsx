import React from "react";
import Chat from "./chat/chat";
import Authorization from "./authorization";
import {flux} from "../decorators";

@flux(['auth'])
export default class Start extends React.Component {

  render() {
    if(!this.state.authedId) {
      return <Authorization authService={this.props.authService} />;
    }
    return <Chat replayer={this.props.replayer} user={this.state.authedId}
      parser={this.props.parser} token={this.state.token} />;
  }

}
