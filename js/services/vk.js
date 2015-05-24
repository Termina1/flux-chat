import {VK_AUTH_LINK, VK_LINK, APP_ID, SCOPE} from "../constants";
import $ from "jsonp";

export default class VKAuth {
  auth() {
    window.open(`${VK_LINK}?client_id=${APP_ID}&scope=${SCOPE}&redirect_uri=https://oauth.vk.com/blank.html&display=popup&v=5.33&response_type=token`);
  }

  api(method, accessToken, params = {}) {
    params.access_token = accessToken;
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
          ref(resp);
        }
      });
    });
  }
}
