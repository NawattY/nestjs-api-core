import { BranchCategoryGetController } from '@controller/v1/backend/merchant/branch-category/branch-category-get.controller';
import { BranchCategoryUpdateStatusController } from './branch-category-update-status.controller';

const BranchCategoryController = [
  BranchCategoryGetController,
  BranchCategoryUpdateStatusController,
];

export default BranchCategoryController;
