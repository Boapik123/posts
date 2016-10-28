const path = require('path');
const controller = require('./auth-controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .get((req, res, next) => {
		res.render('login', { title: 'Posts' });
	})
  .post((...args) => controller.checkAuth(...args));

module.exports = router;
