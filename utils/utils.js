import { readFile } from 'fs';
import multer from 'multer';

export const getOrdersFromFile = (path) => {
    return new Promise(((resolve, reject) => {
        readFile(path,((err, data) => {
            if (err){
                reject(err)
                return
            }
            resolve(data.toString())
        }))
    }))
};

const storage = multer.diskStorage({
    fileFilter: function (req, file, cb) {
        if (file.mimetype == "text/txt") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .txt, format allowed!'));
        }
    },
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, 'data.txt')
    },
})

export const upload = multer({ storage: storage }).single('data');