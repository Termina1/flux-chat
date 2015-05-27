export default class Links {

  escapeHtml(html) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(html));
    return div.innerHTML;
  }

  parseLinks(text) {
    let exp = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;\s]*[-A-Z0-9+&@#\/%=~_|\s])/ig;
    let link = false;
    text = this.escapeHtml(text).replace(exp, function(l) {
      link = l;
      return `<a href="${l}" target="_blank">${l}</a>`;
    });
    return {link, textParsed: text};
  }

}
