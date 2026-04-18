const multer = require('multer'); // upload library
const path = require('path'); //for file extension
const storage = multer.diskStorage({ // save to hard disk(uploads folder)
  destination: (req,file,cb) => { // request, uploaded file, callback
    cb(null, path.join(__dirname, '..', 'uploads')); // save files to backend uploads folder
  },
  filename: (req,file,cb) => { 
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) 
    + path.extname(file.originalname); // 17000000000-123456789.png
    cb(null,uniqueName);
  }
});
const fileFilter = (req,file,cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if(allowedTypes.includes(file.mimetype)) cb(null,true);
  else cb(new Error('Only images allowed'), false);
};
const upload = multer({
  storage,fileFilter, limits: {
    fileSize: 5 * 1024 * 1024 // 5mb
  }
});
module.exports = upload;
