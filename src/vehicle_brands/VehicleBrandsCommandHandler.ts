import axios, { type AxiosError } from 'axios';
import chalk from 'chalk';
import { AuthService } from '../auth/authService';
import vehicleBrandsCreate from '../data/vehicleBrandsCreate.json';
import { API_URL } from '../settings';
import { buildUrl } from '../utils/buildUrl';
import { constructPayloadObj } from '../utils/constructPayloadObj';
import { printObjList, printPaginatedList } from '../utils/print';
import type { BaseListParameters, PaginatedListResponse } from '../utils/types';

const basePath = `${API_URL}/vehicle-brands`;

export class VehicleBrandsCommandHandler {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async list(profileKey: string, filter: string) {
        await this.authService.authenticate(profileKey);

        const url = buildUrl(basePath, { filter });

        try {
            const { data } =
                await axios.get(url);

            printObjList(data, 'Vehicle Brands Response');
        } catch (err) {
            console.log(err);
            console.log(
                chalk.red('Request to get vehicle brands failed'),
                (err as AxiosError).response,
            );
        }
    }

    async create(profileKey: string) {
        await this.authService.authenticate(profileKey);

        chalk.blue.bold('--> Create vehicle brands');
        chalk.blue('Authenticated with profile: ', profileKey);
        chalk.blue('Vehicle Brands to create: ', vehicleBrandsCreate.length);

        const brandsPayloads = [];
        for (const userJsonObj of vehicleBrandsCreate) {
            const payload = await constructPayloadObj(userJsonObj);
            brandsPayloads.push(payload);
        }

        try {
            const results = await Promise.allSettled(
                brandsPayloads.map((payload) => {
                    return axios.post(basePath, payload);
                }),
            );

            console.log('');
            console.log(chalk.green('Results:'));

            for (let i = 0; i < brandsPayloads.length; i++) {
                const result = results[i];
                console.log(`${i + 1}: ${results[i]?.status}`);
                if (result?.status === 'rejected') {
                    console.log(result.reason.response.data);
                }
            }
        } catch {}
    }
}
