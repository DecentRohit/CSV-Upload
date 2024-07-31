const express = require('express')
const csvController = require('../controllers/csvController')
const upload = require('../middleware/multerfileupload')
const csvRouter = express.Router();


// Routes

//to homepage
csvRouter.get('/', csvController.home)

//upload
csvRouter.post('/upload', upload.single('csvFile'), csvController.uploader)

//to view page
csvRouter.get('/view/:fileId', csvController.view)

//delete
csvRouter.get('/delete/:fileId', csvController.delete)

module.exports = csvRouter;