export type DataSourceType = 'csv' | 's3' | 'api';

export type DataSourceStatus = 'active' | 'inactive';

export interface DataSource {
  id: string;
  type: DataSourceType;
  status: DataSourceStatus;
}
