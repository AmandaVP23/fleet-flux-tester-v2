import axios, { type AxiosError } from 'axios';
import chalk from 'chalk';
import { AuthService } from '../auth/authService';
import organizationsCreate from '../data/organizationCreate.json';
import { API_URL } from '../settings';
import { buildUrl } from '../utils/buildUrl';
import { constructPayloadObj } from '../utils/constructPayloadObj';
import { printPaginatedList } from '../utils/print';
import type { PaginatedListResponse } from '../utils/types';
import type { OrganizationDTO, OrganizationListParameters } from './types';

const basePath = `${API_URL}/organizations`;

export class OrganizationsCommandHandler {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async list(profileKey: string, parameters: OrganizationListParameters) {
        await this.authService.authenticate(profileKey);

        const url = this.constructListUrl(parameters);

        try {
            const { data } =
                await axios.get<PaginatedListResponse<OrganizationDTO>>(url);

            printPaginatedList(data, 'Organizations Response');
        } catch (err) {
            console.log(
                chalk.red('Request to get organizations list failed'),
                (err as AxiosError).response,
            );
        }
    }

    async create(profileKey: string) {
        await this.authService.authenticate(profileKey);

        const organizationsPayloads = [];

        for (const orgJsonObj of organizationsCreate) {
            const payload = await constructPayloadObj(orgJsonObj);
            organizationsPayloads.push(payload);
        }

        try {
            const results = await Promise.allSettled(
                organizationsPayloads.map((payload) => {
                    return axios.post(basePath, payload);
                }),
            );

            console.log('');
            console.log(chalk.green('Results:'));

            for (let i = 0; i < organizationsPayloads.length; i++) {
                console.log(`${i + 1}: ${results[i]?.status}`);
            }
        } catch {}
    }

    private constructListUrl(parameters: OrganizationListParameters) {
        const url = buildUrl(basePath, { ...parameters });

        return url;
    }
}
