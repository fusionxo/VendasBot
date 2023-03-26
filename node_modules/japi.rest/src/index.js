const fetch = require('node-fetch'), fs = require('fs');

class JAPIRest {
  constructor(key) {
    this.key = key;
    this.baseUrl = 'https://japi.rest';
    this.checkKey();
    this._init();
  }

  _init() {
    const endpoints = fs.readdirSync(__dirname+'/endpoints').filter(file => file.endsWith('.js'));
    endpoints.map((endpoint,i) => {
      const endpointName = endpoint.replace(/\.js$/,'');
      this[endpointName] = new (require(__dirname+'/endpoints/'+endpoint))(this);
    })
    return true;
  }

  get(endpoint) {
    if(this.checkKey()) return fetch(`${this.baseUrl}/${endpoint}`, { headers: { 'Authorization': `${this.key}` } }).then(res => res.json());
    return null;
  }

  checkKey() {
    if (!this.key) throw new Error('No API key provided');
    if (typeof this.key !== 'string' || !/^JAPI\..{50,54}$/.test(this.key)) throw new Error('Invalid API Key');
    return true;
  }
}

module.exports = JAPIRest;