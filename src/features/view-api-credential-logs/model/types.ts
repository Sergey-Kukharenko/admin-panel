export interface ApiCredentialLogRecord {
  id: string;
  /** Formatted date and time; «—» when the backend did not send it */
  createdAt: string;
  /** Authentik event action as is (technical name, not translated); «—» when absent */
  action: string;
  clientIp: string;
}
