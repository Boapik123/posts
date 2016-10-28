const Router = require('express').Router;
const router = new Router();

const post  = require('./model/post/post-router');
const comment  = require('./model/comment/comment-router');
const auth  = require('./model/auth/auth-router');

router.route('/').get((req, res, next) => {
  res.render('index', { title: 'Posts' });
});

router.route('/admin').get((req, res, next) => {
	if (req.cookies.auth === 'success') {
		res.render('admin', { title: 'Posts' });
	} else {
		res.redirect('/auth');
	}
});

router.use('/auth', auth);
router.use('/post', post);
router.use('/comment', comment);

module.exports = router;
