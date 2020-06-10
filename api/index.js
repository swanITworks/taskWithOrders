import express from 'express';
import orders from "./orders";
import addOrders from "./addOrders";
const { Router } = express;
const mainRouter = Router();

mainRouter.use('/orders',orders);
mainRouter.use('/addOrders',addOrders);
mainRouter.get('/',(req,res)=>{
res.render('main');
});

mainRouter.use((req, res) => {
   res.status(404).json({
      message: 'Not found',
      status: 404,
   });
});

export default mainRouter

