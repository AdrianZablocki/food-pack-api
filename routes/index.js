const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({ content: 'Food pack API demo - Swagger' });
});

module.exports = router;
