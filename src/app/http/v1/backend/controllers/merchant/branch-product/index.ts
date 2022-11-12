import { BranchProductGetController } from './branch-product-get.controller';
import { BranchProductShowController } from '@controller/v1/backend/merchant/branch-product/branch-product-show.controller';
import { BranchProductUpdateStatusAndRecommendController } from '@controller/v1/backend/merchant/branch-product/branch-product-update-status-and-recommend.controller';

const BranchProductController = [
  BranchProductGetController,
  BranchProductShowController,
  BranchProductUpdateStatusAndRecommendController,
];

export default BranchProductController;
