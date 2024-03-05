const express = require('express');
const { registerController, loginController, currentUserController } = require('../controllers/authController');
const authmiddleware = require('../middlewares/authmiddleware');
//const { route } = require('./testRoute')


const router = express.Router()

//Routes
//Register || POST
router.post('/register', registerController);

//Login || POST 
router.post('/login', loginController);

//GET CURRENT USER || GET
router.get('/current-user', authmiddleware, currentUserController)

module.exports = router;