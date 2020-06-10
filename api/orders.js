import express from 'express';
const orders = express.Router()
import {getOrders, getOrdersByCompany, getOrdersByAddress, deleteOrder, getRanking} from '../models/orders'

orders.get('/ranking', async (req, res, next) => {
    //example with database aggregation
    try {
        const ranking = await getRanking();
        return res.render('orders/ranking',{ranking: ranking});
        next();
    } catch (err) {
        console.log(err.message);
        next(err);
    }
});

orders.get('/delete', async (req, res, next) => {
    try {
        const idOrder = req.query.toDelete;
        if (idOrder) {
            const result = await deleteOrder(idOrder);
            if (result.deletedCount) {
                return res.render('orders/deleteSuccess');
            }
            return res.render('orders/deleteFail')
        }
        return res.json({message: 'Please put id'})
        next();
    } catch (err) {
        console.log(err.message);
        next(err);
    }
});

orders.get('/', async (req, res, next) => {
    try {
        const orders = await getOrders();
        const companiesList = [];
        const addressesList = [];
        let orderedProducts = {}

        //more efficient with a large amount of data could be making aggregation on database
        //i made aggregation also on http://localhost:3000/orders/ranking endpoint

        orders.forEach(item => {
            if (item.companyName && companiesList.indexOf(item.companyName) === -1) {
                companiesList.push(item.companyName);
            }
            if (item.customerAddress && addressesList.indexOf(item.customerAddress) === -1) {
                addressesList.push(item.customerAddress);
            }
            const key = item.orderedItem
            orderedProducts = {
                ...orderedProducts,
                [key]: orderedProducts[key] + 1 || 1,
            }
            return orderedProducts
        })

        const sortedOrderedProducts = Object
            .entries(orderedProducts)
            .sort((a, b) => {
                return b[1] - a[1];
            })
            .reduce((_sortedObj, [k, v]) => ({
                ..._sortedObj,
                [k]: v
            }), {})

        if (req.query.companies) {
            const companyName = req.query.companies
            const ordersByCompanyName = await getOrdersByCompany(companyName);
            return res.render('orders/orders', {
                orders: ordersByCompanyName,
                companies: companiesList,
                selected: companyName,
                ranking: sortedOrderedProducts
            });
        }

        if (req.query.address) {
            const customerAddress = req.query.address
            const ordersByCompanyAddress = await getOrdersByAddress(customerAddress);
            return res.render('orders/orders', {
                orders: ordersByCompanyAddress,
                addresses: addressesList,
                selected: customerAddress,
                ranking: sortedOrderedProducts
            });
        }
        return res.render('orders/orders', {
            orders: orders,
            companies: companiesList,
            addresses: addressesList,
            ranking: sortedOrderedProducts
        });

    } catch (err) {
        console.log(err.message);
        next(err);
    }
});

orders.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(err.message)
})

export default orders;