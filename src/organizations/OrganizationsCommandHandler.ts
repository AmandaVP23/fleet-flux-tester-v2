import axios from 'axios';
import { AuthService } from '../auth/authService';
import { API_URL } from '../settings';
import { buildUrl } from '../utils/buildUrl';
import type { OrganizationListParameters } from './types';

const basePath = `${API_URL}/organizations`;

export class OrganizationsCommandHandler {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async list(profileKey: string, parameters: OrganizationListParameters) {
        // todo crete BaseHandler and have this
        await this.authService.authenticate(profileKey);

        const url = this.constructListUrl(parameters);

        try {
            const { data } = await axios.get(url);

            console.log(data);
        } catch (err) {
            // console.log((err as AxiosError).request.headers);
        }
    }

    private constructListUrl(parameters: OrganizationListParameters) {
        const url = buildUrl(basePath, { ...parameters });

        return url;
    }
}
