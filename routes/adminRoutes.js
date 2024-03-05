const express = require('express')
const authmiddleware = require('../middlewares/authmiddleware')
const { getDonarListController, getOrgListController, deleteDonarController } = require('../controllers/adminController')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { getHospitalController } = require('../controllers/inventoryController')

//Routes
const router = express.Router();
// Get || Donar List
router.get('/donar-list', authmiddleware, adminMiddleware, getDonarListController);

//Hospital List
router.get('/hospital-list', authmiddleware, adminMiddleware, getHospitalController);

//ORG List
router.get('/org-list', authmiddleware, adminMiddleware, getOrgListController);
//  =============================================

//Delete Donar || GET
router.delete('/delete-donar/:id', authmiddleware, adminMiddleware, deleteDonarController)


//Export
module.exports = router;