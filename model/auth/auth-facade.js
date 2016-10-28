const Model = require('../../lib/facade');
const authSchema  = require('./auth-schema');


class AuthModel extends Model {}

module.exports = new AuthModel(authSchema);
