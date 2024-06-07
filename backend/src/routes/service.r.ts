import express from 'express'
import { _getAllData,_updateHour,_saveDay, _CheckDay, _saveHistory, _getServices} from '../controllers/service.c'

const router = express.Router()

router.put('/update', _updateHour)
router.get('/data', _getAllData)
router.post('/data', _CheckDay)
router.post('/saveday', _saveDay)
router.post('/history/save', _saveHistory)
router.get('/services', _getServices)
export default router
