import { BranchBannerShowController } from '@controller/v1/backend/merchant/branch-banner/branch-banner-show.controller';
import { BranchBannerUpdateStatusController } from '@controller/v1/backend/merchant/branch-banner/branch-banner-update-status.controller';
import { BranchBannerGetController } from '@controller/v1/backend/merchant/branch-banner/branch-banner-get.controller';

const BranchBannerController = [
  BranchBannerShowController,
  BranchBannerUpdateStatusController,
  BranchBannerGetController,
];

export default BranchBannerController;
