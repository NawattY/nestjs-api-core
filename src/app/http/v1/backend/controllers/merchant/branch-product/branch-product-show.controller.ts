import { Controller, Get, Param, ParseIntPipe, Request } from '@nestjs/common';
import { BranchProductResource } from '@resources/backend/merchant/branch-product/branch-product.resource';
import { BranchProductService } from '@services/backend/merchant/branch-product.service';

@Controller({ path: 'v1/backend/merchant/branch-products' })
export class BranchProductShowController {
  constructor(private readonly branchProductService: BranchProductService) {}

  @Get(':id')
  async show(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
  ): Promise<BranchProductResource> {
    try {
      const product = await this.branchProductService.findById(id, request);

      return BranchProductResource.successResponse(product);
    } catch (error) {
      BranchProductResource.errorResponse(error);
    }
  }
}
