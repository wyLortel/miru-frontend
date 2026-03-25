const ADMIN_NICKNAMES = ['서정진', '찬'];

export function useAdminWriter(writer: string): boolean {
  return ADMIN_NICKNAMES.includes(writer);
}
