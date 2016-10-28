const Controller = require('../../lib/controller');
const authModel  = require('./auth-facade');


class AuthController extends Controller {}

module.exports = new AuthController(authModel);
