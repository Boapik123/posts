const Controller = require('../../lib/controller');
const commentModel  = require('./comment-facade');


class CommentController extends Controller {}

module.exports = new CommentController(commentModel);
