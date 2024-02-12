import express from 'express';
import cors from 'cors';
import UserRouter from './routers/UserRouter.js';
import ProductRouter from './routers/ProductRouter.js';

const app = express();

// enable json and urlencoded for express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for this app , i think without cors is just fine.
app.use(cors());
app.use(express.static('views'));
app.use(express.static('public'));

app.use('/api/user', UserRouter);
app.use('/api/products', ProductRouter);

export default app;
