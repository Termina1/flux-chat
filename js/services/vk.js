import {VK_AUTH_LINK, VK_LINK, APP_ID, SCOPE, MESSAGES_TO_LOAD, VERSION} from "../constants";
import $ from "jsonp";

export default class VKAuth {
  auth() {
    window.open(`${VK_AUTH_LINK}?client_id=${APP_ID}&scope=${SCOPE}&redirect_uri=https://oauth.vk.com/blank.html&display=popup&v=5.33&response_type=token`);
  }

  getUser(token, id) {
    let params = {fields: 'photo_100'};
    if(id) {
      params.user_id = id;
    }
    return this.api("users.get", token, params);
  }

  loadMoreMessages(token, id, userId) {
    return this.api("messages.getHistory", token, {
      start_message_id: id,
      user_id: userId,
      offset: 0,
      count: MESSAGES_TO_LOAD
    }).then((resp) => {
      resp.items = resp.items.slice(1);
      return resp;
    });
  }

  sendMessage(token, message, reciever) {
    return this.api("messages.send", token, {
      user_id: reciever,
      message: message.text,
      guid: message.id,
    });
  }

  api(method, accessToken, params = {}) {
    params.access_token = accessToken;
    params.v = VERSION;
    let lparams = Object.keys(params)
      .map(el => `${el}=${params[el]}`)
      .join('&');

    return new Promise((ref, rej) => {
      $(`${VK_LINK}/${method}?${lparams}`, function(err, resp) {
        if(err || resp.error) {
          rej({
            error: err || resp.error,
            params: params
          });
        } else {
          ref(resp.response);
        }
      });
    });
  }
}
