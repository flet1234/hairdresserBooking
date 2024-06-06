import express from 'express'
import { _getAllData,_updateHour,_saveDay, _CheckDay} from '../controllers/service.c'

const router = express.Router()

router.put('/update', _updateHour)
router.get('/data', _getAllData)
router.post('/data', _CheckDay)
router.post('/saveday', _saveDay)
// router.put('/saveday', _updateDay)

export default router
