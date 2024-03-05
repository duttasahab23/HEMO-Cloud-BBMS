const express = require('express')
const authmiddleware = require('../middlewares/authmiddleware')

const { createInventoryController, getInventoryController, getDonarsController, getHospitalController, getOrganizationController, getOrganizationForHospitalController, getInventoryHospitalController, getRecentInventoryController } = require('../controllers/inventoryController');

const router = express.Router();


//routes
//ADD INVENTORY || POST
router.post('/create-inventory', authmiddleware, createInventoryController);

// GET ALL BLOOD RECORDS
router.get('/get-inventory', authmiddleware, getInventoryController);

// GET RECENT BLOOD RECORDS
router.get('/get-recent-inventory', authmiddleware, getRecentInventoryController);

// GET Hospital BLOOD RECORDS
router.post('/get-inventory-hospital', authmiddleware, getInventoryHospitalController);

// Get Donar Records
router.get('/get-donars', authmiddleware, getDonarsController);

// Get Hospital Records
router.get('/get-hospitals', authmiddleware, getHospitalController);

// Get Organization Records
router.get('/get-organization', authmiddleware, getOrganizationController);

// Get Organization Records for Hospital
router.get('/get-organization-for-hospital', authmiddleware, getOrganizationForHospitalController);

module.exports = router; 