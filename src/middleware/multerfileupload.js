const multer = require('multer')
const path = require('path')

//create storage for CSV file using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("public", "uploads"));
  },
  filename: (req, file, cb) => {
    //adding date prefix to every uploaded file to prevent duplicate names
    const updatedFileName = Date.now() + file.originalname;
    cb(null, updatedFileName);
  },
});

const upload = multer({ storage: storage })
module.exports = upload;