import { IPagination } from 'src/common/interfaces/pagination';

interface IMeta extends IPagination {
  totalPages?: number;
  totalItems?: number;
}

export class PaginatedData {
  data: any[];
  meta: IMeta;

  constructor(pagination: IPagination, data: any[], totalItems: number) {
    const pageNumber = pagination?.pageNumber;
    const pageSize = pagination?.pageSize;
    this.meta = {
      pageNumber,
      pageSize,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
    this.data = data;
  }
}
