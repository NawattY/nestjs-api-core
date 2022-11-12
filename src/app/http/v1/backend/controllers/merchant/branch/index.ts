import { BranchDestroyController } from '@controller/v1/backend/merchant/branch/branch-destroy.controller';
import { BranchStoreController } from '@controller/v1/backend/merchant/branch/branch-store.controller';
import { BranchUpdateController } from '@controller/v1/backend/merchant/branch/branch-update.controller';
import { BranchUpdateStatusController } from '@controller/v1/backend/merchant/branch/branch-update-status.controller';
import { BranchShowController } from '@controller/v1/backend/merchant/branch/branch-show.controller';
import { BranchGetController } from '@controller/v1/backend/merchant/branch/branch-get.controller';

const BranchController = [
  BranchStoreController,
  BranchUpdateController,
  BranchDestroyController,
  BranchUpdateStatusController,
  BranchShowController,
  BranchGetController,
];

export default BranchController;
