import type { BaseListParameters } from '../utils/types';

export interface UsersListParameter extends BaseListParameters {
    organizationId: number | null;
    role: string | null;
}

export interface UserDTO {
    firstName: string;
    lastName: string;
    email: string;
    organizationId: number;
    role: string;
}