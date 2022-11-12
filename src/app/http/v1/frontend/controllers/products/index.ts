import { ProductGetController } from '@controller/v1/frontend/products/product-get.controller';
import { ProductShowController } from '@controller/v1/frontend/products/product-show.controller';

const ProductController = [ProductGetController, ProductShowController];

export default ProductController;
