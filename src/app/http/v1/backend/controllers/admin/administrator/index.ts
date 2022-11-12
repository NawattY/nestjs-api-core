import { AdministratorGetController } from '@controller/v1/backend/admin/administrator/administrator-get.controller';
import { AdministratorStoreController } from '@controller/v1/backend/admin/administrator/administrator-store.controller';
import { AdministratorUpdateController } from '@controller/v1/backend/admin/administrator/administrator-update.controller';
import { AdministratorDestroyController } from './administrator-destroy.controller';
import { AdministratorShowController } from '@controller/v1/backend/admin/administrator/administrator-show.controller';

const AdministratorController = [
  AdministratorStoreController,
  AdministratorUpdateController,
  AdministratorGetController,
  AdministratorDestroyController,
  AdministratorShowController,
];

export default AdministratorController;
