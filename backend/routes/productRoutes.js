import express from 'express';

import {
   getProducts,
   getProductsByID
} from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProductsByID);

export default router;
