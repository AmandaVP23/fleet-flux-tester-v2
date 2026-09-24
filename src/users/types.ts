import type { BaseDTO, BaseListParameters } from '../utils/types';

export interface UsersListParameter extends BaseListParameters {
    organizationId: number | null;
}

export interface UserDTO extends BaseDTO {
    name: string;
}
