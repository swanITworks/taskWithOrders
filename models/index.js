import mongoose from 'mongoose';
import {DB_ADDRESS, DB_PORT, DB_NAME} from '../config/db'

const connectToMongoose = async () => {
    const url = `mongodb://${DB_ADDRESS}:${DB_PORT}/${DB_NAME}`;
    const connection = mongoose.connection;
    connection.once("open", function () {
            console.log("*** MongoDB got connected ***");
            console.log(`Our Current Database Name : ${connection.db.databaseName}`);
            mongoose.connection.db.dropDatabase(
                console.log(`${connection.db.databaseName} database dropped.`)
            );
        }
    )
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
}

export {connectToMongoose};




