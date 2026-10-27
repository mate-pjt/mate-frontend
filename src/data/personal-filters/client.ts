import { getDataConfig } from "../config";
import { getMockRuntime } from "../mock/runtime";
import { getHttpClient } from "../shared/client";
import type { PersonalFiltersRepository } from "./contracts";
import { createHttpPersonalFiltersRepository } from "./http-repository";
import { createMockPersonalFiltersRepository } from "./mock-repository";
export type * from "./contracts";

let repository: PersonalFiltersRepository | null = null;
function getRepository(): PersonalFiltersRepository { return repository ??= getDataConfig().sources.personalFilters === "mock" ? createMockPersonalFiltersRepository(getMockRuntime()) : createHttpPersonalFiltersRepository(getHttpClient()); }
export const getPersonalFilter: PersonalFiltersRepository["getPersonalFilter"] = (...args) => getRepository().getPersonalFilter(...args);
export const savePersonalFilter: PersonalFiltersRepository["savePersonalFilter"] = (...args) => getRepository().savePersonalFilter(...args);
export const resetPersonalFilter: PersonalFiltersRepository["resetPersonalFilter"] = (...args) => getRepository().resetPersonalFilter(...args);
