import { getDataConfig } from "../config";
import { createHttpClient } from "./http";
let client: ReturnType<typeof createHttpClient> | null = null;
export function getHttpClient() { return client ??= createHttpClient(getDataConfig().apiEnvironment); }
