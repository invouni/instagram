const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

// Configure storage options for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');  // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuid.v4();
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);  // Unique file name
  }
});

// Initialize upload middleware with configured storage
const upload = multer({ storage: storage });

module.exports = upload;