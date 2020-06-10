import mongoose from 'mongoose';

export const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        require: true,
    },
    companyName: {
        type: String,
        require: true,
    },
    customerAddress: {
        type: String,
        require: true,
    },
    orderedItem: {
        type: String,
        require: true,
    },
}, {versionKey: false})

export const Order = mongoose.model('Order', orderSchema);

export const addOrdersToDB = async (orderData) => {
    await Order.insertMany(orderData)
}

export const getOrders = async () => {
    const orders = await Order.find({}).lean().exec();
    return orders
}

export const getOrdersByCompany = async (companyName) => {
    const ordersByCompanyName = await Order.find({companyName: companyName}).lean().exec();
    return ordersByCompanyName
}

export const getOrdersByAddress = async (customerAddress) => {
    const ordersByAddress = await Order.find({customerAddress: customerAddress}).lean().exec();
    return ordersByAddress
}

export const deleteOrder = async (orderId) => {
    const result = await Order.deleteOne({orderId: orderId})
    return result
}

export const getRanking = async () => {
    const ranking = await Order.aggregate([{
        "$group": {
            "_id": "$orderedItem",
            "ordered": {"$sum": 1}
        }
    }]).sort({ordered: -1});
    return ranking
}


