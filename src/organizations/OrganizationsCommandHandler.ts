import type { AxiosError } from 'axios';
import axios from 'axios';
import { AuthService } from '../auth/authService';
import { getInfoFromProfile, login } from '../auth/login';
import { API_URL } from '../settings';
import { buildUrl } from '../utils/buildUrl';
import type { OrganizationListParameters } from './types';

const basePath = `${API_URL}/organizations`;

export class OrganizationsCommandHandler {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async list(authProfile: string, parameters: OrganizationListParameters) {
        // todo crete BaseHaandler and have this
        const authSaved = this.authService.getAuthInformation();
        console.log('saved', authSaved);
        if (
            authSaved?.profileInformation.email !==
            getInfoFromProfile(authProfile)?.email
        ) {
            await login(authProfile);
        } else {
            await this.authService.refresh();
        }

        const url = this.constructListUrl(parameters);
        console.log(url);

        try {
            const { data } = await axios.get(url);

            console.log(data);
        } catch (err) {
            console.log((err as AxiosError).request.headers);
        }
        // axiosInstance.get(``);
    }

    private constructListUrl(parameters: OrganizationListParameters) {
        const url = buildUrl(basePath, { ...parameters });

        return url;
    }
}
