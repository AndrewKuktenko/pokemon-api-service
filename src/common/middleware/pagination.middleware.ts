import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { IPagination } from 'src/common/interfaces/pagination';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  private defaultPageSize: number = this.configService.get<number>(
    'pagination.default_page_size',
  );
  private defaultPageNumber: number = this.configService.get<number>(
    'pagination.default_page_number',
  );
  private maxPageSize: number = this.configService.get<number>(
    'pagination.max_page_size',
  );

  use(req: any, res: Response, next: () => void) {
    const pageSize = req.query.pageSize as string;
    const pageNumber = req.query.pageNumber as string;

    const pagination: IPagination = {
      pageSize: parseInt(pageSize, 10) || this.defaultPageSize,
      pageNumber: parseInt(pageNumber, 10) || this.defaultPageNumber,
    };

    if (pagination.pageSize > this.maxPageSize)
      throw new BadRequestException(
        `pageSize can't be greater than ${this.maxPageSize}`,
      );

    req.pagination = pagination;

    next();
  }
}
