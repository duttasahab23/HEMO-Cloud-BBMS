const express = require('express')
const authmiddleware = require('../middlewares/authmiddleware');
const { bloodGroupDetailsController } = require('../controllers/analyticsController');


const router = express.Router();


//routes


// Get Blood Data Records
router.get('/bloodGroups-data', authmiddleware, bloodGroupDetailsController);

module.exports = router; 