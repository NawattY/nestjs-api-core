import { GetParamsInterface } from '@interfaces/branch-product/get-params.interface';
import { Controller, Get, Request, Query } from '@nestjs/common';
import { BranchProductResource } from '@resources/backend/merchant/branch-product/branch-product.resource';
import { BranchProductService } from '@services/backend/merchant/branch-product.service';

@Controller({ path: 'v1/backend/merchant/branch-products' })
export class BranchProductGetController {
  constructor(private readonly branchProduct: BranchProductService) {}

  @Get('/')
  async get(
    @Request() request: any,
    @Query() query: GetParamsInterface,
  ): Promise<BranchProductResource> {
    try {
      const products = await this.branchProduct.get(request.branchId, query);

      return BranchProductResource.successResponse(products);
    } catch (error) {
      BranchProductResource.errorResponse(error);
    }
  }
}
