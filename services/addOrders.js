import { addOrdersToDB } from "../models/orders";
import { getOrdersFromFile } from "../utils/utils"
import { upload } from "../utils/utils";

export default class AddOrders {
    upload = upload;
    async getFileAndSaveToDB() {
        try {
            const data = await getOrdersFromFile('./uploads/data.txt')
            const dataInArray = data.split('\n');
            const ordersFeaturesArray = dataInArray.map(order => {
                return order.split(',');
            })
            const ordersArrayWithFeaturesInObject = ordersFeaturesArray.map(order => {
                return (
                    {
                        orderId: order[0].trim(),
                        companyName: order[1].trim(),
                        customerAddress: order[2].trim(),
                        orderedItem: order[3].trim(),
                    }
                )
            })
            await addOrdersToDB(ordersArrayWithFeaturesInObject);
            return true
        } catch (err) {
            throw err;
        }
    }
}