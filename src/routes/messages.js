import express from 'express'
import messagesController from '../controllers/messageController.js'
const router = express.Router()
router.get('/', messagesController.getMessages)
router.post('/', messagesController.createMessage)
export default router