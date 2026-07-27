import type { BaseListParameters } from '../utils/types';

export interface OrganizationListParameters extends BaseListParameters {
    filter: string | null;
}
