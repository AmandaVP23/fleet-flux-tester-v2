import axios, { type AxiosError } from 'axios';
import chalk from 'chalk';
import { AuthService } from '../auth/authService';
import vehicleDriverAssignmentCreate from '../data/vehicleDriverAssignmentCreate.json';
import { API_URL } from '../settings';
import { buildUrl } from '../utils/buildUrl';
import { constructPayloadObj } from '../utils/constructPayloadObj';
import { printPaginatedList } from '../utils/print';
import type { BaseListParameters, PaginatedListResponse } from '../utils/types';

const basePath = `${API_URL}/vehicle-assignment`;

interface VehicleDriverAssignmentListParameters extends BaseListParameters {
    driverId: number | null;
    organizationId: number | null;
    vehicleId: number | null;
}

export class VehicleDriverAssignmentsCommandHandler {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async list(profileKey: string, parameters: VehicleDriverAssignmentListParameters) {
        await this.authService.authenticate(profileKey);

        const url = buildUrl(basePath, { ...parameters });

        try {
            const { data } = await axios.get<PaginatedListResponse>(url);

            printPaginatedList(data, 'Vehicle->Driver Assingment Response');
        } catch (err) {
            console.log(
                chalk.red('Request to get vehicles driver assignments list failed'),
                (err as AxiosError).response,
            );
        }
    }

    async create(profileKey: string) {
        await this.authService.authenticate(profileKey);

        chalk.blue.bold('--> Create vehicle driver assignment');
        chalk.blue('Authenticated with profile: ', profileKey);
        chalk.blue('Vehicle driver assignments to create: ', vehicleDriverAssignmentCreate.length);

        const vehicleDriverPayloads = [];
        for (const vehicleDriverJsonObj of vehicleDriverAssignmentCreate) {
            const payload = await constructPayloadObj(vehicleDriverJsonObj);
            vehicleDriverPayloads.push(payload);
        }

        try {
            const results = await Promise.allSettled(
                vehicleDriverPayloads.map((payload) => {
                    return axios.post(basePath, payload);
                }),
            );

            console.log('');
            console.log(chalk.green('Results:'));

            for (let i = 0; i < vehicleDriverPayloads.length; i++) {
                const result = results[i];
                console.log(`${i + 1}: ${result?.status}`);
                if (result?.status === 'rejected') {
                    console.log(result.reason.response.status)
                    if (result.reason.response.data) {
                        console.log(result.reason.response.data);   
                    }
                }
            }
        } catch {}
    }
}
