const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const multerConfig = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                const fileName = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, fileName);
            })
        }
    }),
    limits: {
        fileSize: 100 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ["video/mp4", "video/mkv", "video/mov", "video/avi", "video/MPEG-4", "video/H.264"];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        }
        else {
            cb(new Error("Invalid file type"));
        }
    }
};

module.exports = app => {
    const routeController = app.controllers.uploadFile;

    app.route('/api/sendFile')
        .post(routeController.uploadFileAW);

    app.route('/api/getFilesList')
        .get(routeController.getFileList, multer(multerConfig).single('file'));
}