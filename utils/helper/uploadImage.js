const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  },
})

const ImageUploader = multer({
  storage: storage,
  limits: { fileSize: 3000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
}).single('file')

function checkFileType(file, cb) {
  //Allow extensions
  const filetypes = /jpeg|jpg|png|svg|gif/
  //check extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  //Check MimeTypes
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only')
  }
}

module.exports = ImageUploader
