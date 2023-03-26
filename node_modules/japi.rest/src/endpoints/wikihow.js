const Endpoint = require('../Endpoint.js');
module.exports = class WikiHow extends Endpoint {
  constructor(main) { super(main, 'wikihow/v1/') };

  search(query) {
    if(!query) throw new Error('No search query provided');
    return this._get('search?='+encodeURIComponent(query));
  }

  info(articleName) {
    if(!articleName) throw new Error('No article name provided');
    return this._get('info/'+articleName);
  }
}