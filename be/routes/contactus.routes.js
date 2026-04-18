const express = require('express');
const router = express.Router();
const contactusController = require('../controllers/contactus.controller');
router.post('/', contactusController.contactUs);
module.exports = router