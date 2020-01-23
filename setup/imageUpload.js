let multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '../images');
    },
    filename: (req, file, callback) => {
        console.log(file)
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    }
})
const upload = multer({ storage: storage }).array('imageUploader', 3);

module.exports = {
    upload
}

