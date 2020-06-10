import express from 'express'
import Handlebars from 'handlebars';
const app = express();
import {APP_PORT} from './config/app'
import mainRouter from './api/index'
import {connectToMongoose} from "./models";
import exhbs from "express-handlebars";

const hbs = exhbs.create({
        helpers: {
            check: function (item,selected) {
                const selectedNow = selected.data.root.selected;
                let result = '';
                if (selectedNow && selectedNow === item) {
                    result = "<option selected='selected'>" + Handlebars.escapeExpression(item) + "</option>"
                } else {
                    result = "<option>" + Handlebars.escapeExpression(item) + "</option>"
                }
                return new Handlebars.SafeString(result)
            }
        }
    }
);

(async function runApp() {
    try {
        app.engine('handlebars', hbs.engine);
        app.set('view engine', 'handlebars');
        await connectToMongoose();
        app.use(express.static('public'))
        app.use('/addOrders', express.static('uploads'));
        app.use(mainRouter);
        app.listen(APP_PORT, () => {
            console.log(`Server running at http://localhost:${APP_PORT}/`);
        });
    } catch (err) {
        console.log('Problem with initializing the app', err)
    }
})();

