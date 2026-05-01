import PocketBase from "pocketbase";

export const pocketBaseUrl =
  process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090";

export function createPocketBaseClient(): PocketBase {
  return new PocketBase(pocketBaseUrl);
}
