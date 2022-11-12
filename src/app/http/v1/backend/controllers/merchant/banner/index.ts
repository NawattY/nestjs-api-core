import { BannerStoreController } from '@controller/v1/backend/merchant/banner/banner-store.controller';
import { BannerGetController } from '@controller/v1/backend/merchant/banner/banner-get.controller';
import { BannerUpdateController } from '@controller/v1/backend/merchant/banner/banner-update.controller';
import { BannerDestroyController } from '@controller/v1/backend/merchant/banner/banner-destroy.controller';
import { BannerShowController } from '@controller/v1/backend/merchant/banner/banner-show.controller';
import { BannerUpdateStatusController } from '@controller/v1/backend/merchant/banner/banner-update-status.controller';
import { BannerUpdateOrdinalController } from './banner-update-ordinal.controller';

const BannerController = [
  BannerStoreController,
  BannerGetController,
  BannerUpdateOrdinalController,
  BannerUpdateController,
  BannerDestroyController,
  BannerShowController,
  BannerUpdateStatusController,
];

export default BannerController;
