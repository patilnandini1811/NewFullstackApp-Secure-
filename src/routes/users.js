import express from 'express'
import usersController from '../controllers/usersController.js'
const router = express.Router()
router.get('/getuser/:id', usersController.getUsers)
router.post('/login', usersController.login)
router.post('/register', usersController.register)
router.get('/autologin', usersController.autoLogin);
export default router
