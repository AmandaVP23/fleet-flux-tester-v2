import type { BaseListParameters } from '../utils/types';

export interface UsersListParameter extends BaseListParameters {
    organizationId: number | null;
}
