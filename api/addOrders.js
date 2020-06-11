import express from 'express';
import AddOrders from '../services/addOrders'
const addOrders = express.Router()
const addOrd = new AddOrders();



addOrders.post('/uploads', addOrd.upload, async (req, res, next) => {
    try {
        if (req.file && req.file.mimetype == 'text/plain') {
            await addOrd.getFileAndSaveToDB();
            return res.render('addOrders/success')
        }
        throw new Error('file not uploaded: file not attached or wrong format of file')
    } catch (err) {
        console.log(err.message);
        next(err);
    }
});

addOrders.get('/', async (req, res, next) => {
    try {
        return res.render('addOrders/addFile')
    } catch (err) {
        console.log(err.message);
        next(err);
    }
});

addOrders.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(err.message)
})



export default addOrders;