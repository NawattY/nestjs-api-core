import { CategoryStoreController } from '@controller/v1/backend/merchant/category/category-store.controller';
import { CategoryUpdateController } from '@controller/v1/backend/merchant/category/category-update.controller';
import { CategoryDestroyController } from '@controller/v1/backend/merchant/category/category-destroy.controller';
import { CategoryShowController } from '@controller/v1/backend/merchant/category/category-show.controller';
import { CategoryUpdateStatusController } from '@controller/v1/backend/merchant/category/category-update-status.controller';
import { CategoryGetController } from '@controller/v1/backend/merchant/category/category-get.controller';
import { CategoryUpdateOrdinalController } from './category-update-ordinal.controller';

const CategoryController = [
  CategoryStoreController,
  CategoryUpdateOrdinalController,
  CategoryUpdateController,
  CategoryDestroyController,
  CategoryShowController,
  CategoryUpdateStatusController,
  CategoryGetController,
];

export default CategoryController;
