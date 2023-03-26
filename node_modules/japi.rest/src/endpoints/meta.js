const Endpoint = require('../Endpoint.js');
module.exports = class Meta extends Endpoint {
  constructor(main) { super(main, 'meta/v1/'); }

  get(url) {
    if(!url || typeof url !== 'string' || /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/.test(url)) throw new Error('The url provided is invalid.');
    return this._get('get?site='+encodeURIComponent(url));
  }
}