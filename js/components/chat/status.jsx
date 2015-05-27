import React from "react";
import cx from "classnames";

export default class Status extends React.Component {

  render() {
    let text;
    let chat = this.props.chat || {};
    if(chat.status) {
      let user = this.props.users[chat.status] || {};
      text = `${user.first_name} набирает сообщение...`;
    }
    let cls = cx({
      'b-chat-container--status': true,
      'b-chat-container--status_visible': !!chat.status
    });
    return (
      <div className={cls}>&nbsp;{text}</div>
    );
  }

}
