import type { BaseDTO, BaseListParameters } from '../utils/types';

export interface OrganizationListParameters extends BaseListParameters {
    filter: string | null;
}

export interface OrganizationDTO extends BaseDTO {
    name: string;
}
