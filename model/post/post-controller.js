const Controller = require('../../lib/controller');
const postModel  = require('./post-facade');


class PostController extends Controller {}

module.exports = new PostController(postModel);
