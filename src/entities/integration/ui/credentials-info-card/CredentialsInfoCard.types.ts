export interface CredentialsInfoRow {
  label: string;
  value: string;
  /** false for placeholder values (e.g. «—» while there is no credential yet) */
  copyable: boolean;
}
