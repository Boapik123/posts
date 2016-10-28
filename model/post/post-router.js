const path = require('path');
const controller = require('./post-controller');
const Router = require('express').Router;
var pug = require('pug');
const router = new Router();

const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        var filename = path.basename(file.originalname, ext);
        var fullFileName = filename + '-' + Date.now() + ext;
        req.body.image = fullFileName;
        cb(null, fullFileName)
    }
});

const upload = multer({ storage: storage });

router.route('/')
  .get((...args) => controller.find(...args))
  .post(upload.single('image'), (...args) => controller.create(...args));

router.route('/:id')
  .put((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args));

module.exports = router;
