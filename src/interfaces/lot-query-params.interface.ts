export interface BaseLotQueryParams {
  manufacturer: string;
  modelName: string;
  sinceYear: number;
  tillYear: number;
}

export interface PagingLotQueryParams extends BaseLotQueryParams {
  page: number;
}

export interface SinceLotQueryParams extends BaseLotQueryParams {
  sinceLotId: string;
}
