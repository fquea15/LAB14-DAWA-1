const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'video/quicktime'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Tipo de archivo no permitido'), false);
        }
        const maxSize = 5 * 1024 * 1024; //5MB
        if (file.size > maxSize) {
            return cb(new Error('El archivo excede el tamaño máximo permitido'), false);
        }

        cb(null, true);
    },
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

app.post('/upload', upload.array('files', 5), (req, res) => {
    const fileInfos = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
    }));

    res.send(fileInfos);
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
