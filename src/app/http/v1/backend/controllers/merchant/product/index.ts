import { ProductGetController } from '@controller/v1/backend/merchant/product/product-get.controller';
import { ProductDestroyController } from '@controller/v1/backend/merchant/product/product-destroy.controller';
import { ProductUpdateStatusController } from '@controller/v1/backend/merchant/product/product-update-status.controller';
import { ProductStoreController } from '@controller/v1/backend/merchant/product/product-store.controller';
import { ProductShowController } from '@controller/v1/backend/merchant/product/product-show.controller';
import { ProductUpdateController } from '@controller/v1/backend/merchant/product/product-update.controller';

const ProductController = [
  ProductGetController,
  ProductDestroyController,
  ProductUpdateStatusController,
  ProductStoreController,
  ProductShowController,
  ProductUpdateController,
];

export default ProductController;
