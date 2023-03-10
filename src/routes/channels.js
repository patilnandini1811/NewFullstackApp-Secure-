import express from 'express'
import channelsController from '../controllers/channelController.js'
const router = express.Router()
router.get('/', channelsController.getChannels)
router.get('/:id/messages', channelsController.getMessagesByChannel)
router.post('/', channelsController.createChannel)
export default router