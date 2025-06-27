const express = require('express');
const router = express.Router();
const multer = require('multer');
const speechController = require('../controllers/speech.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

router.post('/transcribe', upload.single('audio'), speechController.processAudio);
router.post('/translate', speechController.translateText);

module.exports = router;