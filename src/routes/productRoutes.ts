import { Router } from 'express';


const productRoutes = Router();


productRoutes.get('/products');
productRoutes.get('/products/:id');
productRoutes.post('/products'); // admin
productRoutes.patch('/products:id'); // admin
productRoutes.delete('/products:id'); //admin