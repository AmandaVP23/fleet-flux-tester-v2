import axios, { type AxiosError } from 'axios';
import chalk from 'chalk';
import { AuthService } from '../auth/authService';
import vehicleCreate from '../data/vehicleCreate.json';
import { API_URL } from '../settings';
import { buildUrl } from '../utils/buildUrl';
import { constructPayloadObj } from '../utils/constructPayloadObj';
import { printPaginatedList } from '../utils/print';
import type { BaseListParameters, PaginatedListResponse } from '../utils/types';

const basePath = `${API_URL}/vehicles`;

interface VehicleListParameters extends BaseListParameters {
    organizationId: number | null;
    brandId: number | null;
}

export class VehiclesCommandHandler {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async list(profileKey: string, parameters: VehicleListParameters) {
        await this.authService.authenticate(profileKey);

        const url = buildUrl(basePath, { ...parameters });

        try {
            const { data } = await axios.get<PaginatedListResponse>(url);

            printPaginatedList(data, 'Vehicles Response');
        } catch (err) {
            console.log(
                chalk.red('Request to get vehicles list failed'),
                (err as AxiosError).response,
            );
        }
    }

    async create(profileKey: string) {
        await this.authService.authenticate(profileKey);

        chalk.blue.bold('--> Create vehicle');
        chalk.blue('Authenticated with profile: ', profileKey);
        chalk.blue('Vehicles to create: ', vehicleCreate.length);

        const vehiclePayloads = [];
        for (const vehicleJsonObj of vehicleCreate) {
            const payload = await constructPayloadObj(vehicleJsonObj);
            vehiclePayloads.push(payload);
        }

        try {
            const results = await Promise.allSettled(
                vehiclePayloads.map((payload) => {
                    return axios.post(basePath, payload);
                }),
            );

            console.log('');
            console.log(chalk.green('Results:'));

            for (let i = 0; i < vehiclePayloads.length; i++) {
                const result = results[i];
                console.log(`${i + 1}: ${results[i]?.status}`);
                if (result?.status === 'rejected') {
                    console.log(result.reason.response.data);
                }
            }
        } catch {}
    }
}
