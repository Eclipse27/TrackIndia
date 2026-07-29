const express = require('express')
const router = express.Router()
const { getTrains, getTrainById } = require('../controllers/trainController')

router.get('/', getTrains)
router.get('/:id', getTrainById)

module.exports = router
