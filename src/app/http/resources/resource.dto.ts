import { Expose } from 'class-transformer';
import { IPaginationMeta, IPaginationLinks } from 'nestjs-typeorm-paginate';

export class ResourceDto {
  @Expose()
  status: {
    code: number;
    message: string;
  };
}

export class ResourcesDto {
  @Expose()
  status: {
    code: number;
    message: string;
  };

  @Expose()
  meta: IPaginationMeta;

  @Expose()
  links: IPaginationLinks;
}
