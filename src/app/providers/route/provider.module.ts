import { Module } from '@nestjs/common';
import { BackendModule as BackendV1 } from 'src/app/http/v1/backend/backend.module';
import { FrontendModule as FrontendV1 } from 'src/app/http/v1/frontend/frontend.module';

@Module({
  imports: [BackendV1, FrontendV1],
})
export class RouteProviderModule {}
