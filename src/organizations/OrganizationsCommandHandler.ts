import axios, { type AxiosError } from 'axios';
import chalk from 'chalk';
import { AuthService } from '../auth/authService';
import organizationsCreate from '../data/organizationCreate.json';
import { BaseEndpoints } from '../endpoints';
import { buildUrl } from '../utils/buildUrl';
import { constructPayloadObj } from '../utils/constructPayloadObj';
import { printPaginatedList } from '../utils/print';
import type { PaginatedListResponse } from '../utils/types';
import type { OrganizationListParameters } from './types';

const basePath = BaseEndpoints.Organizations;

export class OrganizationsCommandHandler {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async list(profileKey: string, parameters: OrganizationListParameters) {
        await this.authService.authenticate(profileKey);

        const url = this.constructListUrl(parameters);

        try {
            const { data } = await axios.get<PaginatedListResponse>(url);

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

        chalk.blue.bold('--> Create organizations');
        chalk.blue('Authenticated with profile: ', profileKey);
        chalk.blue('Organizations to create: ', organizationsCreate.length);

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

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                console.log(`${i + 1}: ${result?.status}`);
                if (result?.status === 'rejected') {
                    console.log('status: ', result.reason.status);
                }
            }
        } catch {}
    }

    private constructListUrl(parameters: OrganizationListParameters) {
        const url = buildUrl(basePath, { ...parameters });

        return url;
    }
}
