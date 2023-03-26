const Endpoint = require('../Endpoint.js');
module.exports = class Discord extends Endpoint {
  constructor(main) { super(main, 'discord/v1/'); };

  getUser(userid) {
    if(!userid || typeof userid !== 'string' || userid.length < 1) throw new Error('Invalid user id');
    return this._get('user/'+userid);
  }

  getInvite(code) {
    if(!code || typeof code !== 'string' || code.length < 1) throw new Error('Invalid invite code');
    return this._get('invite/'+code);
  }

  getTemplate(code) {
    if(!code || typeof code !== 'string' || code.length < 1) throw new Error('Invalid template code');
    return this._get('template/'+code);
  }

  getApplication(id) {
    if(!id || typeof id !== 'string' || id.length < 1) throw new Error('Invalid application id');
    return this._get('application/'+id);
  }
}