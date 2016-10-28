const Model = require('../../lib/facade');
const postSchema  = require('./post-schema');


class PostModel extends Model {}

module.exports = new PostModel(postSchema);
