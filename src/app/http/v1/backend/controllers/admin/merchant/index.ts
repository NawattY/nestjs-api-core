import { MerchantGetByIdController } from './merchant-show.controller';
import { MerchantUpdateStatusController } from './merchant-update-status.controller';
import { MerchantGetController } from './merchant-get.controller';
import { MerchantDestroyController } from './merchant-destroy.controller';
import { MerchantUpdateController } from './merchant-update.controller';
import { MerchantStoreController } from './merchant-store.controller';
import { MerchantConnectionRollbackController } from './merchant-connection-rollback.controller';
import { MerchantConnectionMigrateController } from './merchant-connection-migrate.controller';

const MerchantController = [
  MerchantGetByIdController,
  MerchantStoreController,
  MerchantUpdateStatusController,
  MerchantUpdateController,
  MerchantGetController,
  MerchantDestroyController,
  MerchantConnectionRollbackController,
  MerchantConnectionMigrateController,
];

export default MerchantController;
