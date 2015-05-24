export default class Links {

  parseLinks(text) {
    let exp = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    let link = false;
    text = text.replace(exp, function(l) {
      link = l;
      return `<a href="${l}" target="_blank">${l}</a>`;
    });
    return {link, textParsed: text};
  }

}
