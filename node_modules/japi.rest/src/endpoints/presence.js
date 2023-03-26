const Endpoint = require('../Endpoint.js');
module.exports = class JAPIPresence extends Endpoint {
  constructor(main) { super(main, 'presence/v1/') };

  get(identifer) {
    if(!identifer) throw new Error('No JAPI identifer provided.');
    return this._get('get?id='+identifer);
  }
}