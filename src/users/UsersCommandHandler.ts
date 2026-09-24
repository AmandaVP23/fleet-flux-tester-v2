import axios, { type AxiosError } from 'axios';
import chalk from 'chalk';
import { AuthService } from '../auth/authService';
import usersCreate from '../data/usersCreate.json';
import { API_URL } from '../settings';
import { buildUrl } from '../utils/buildUrl';
import { constructPayloadObj } from '../utils/constructPayloadObj';
import { printPaginatedList } from '../utils/print';
import type { PaginatedListResponse } from '../utils/types';
import type { UserDTO, UsersListParameter } from './types';

const basePath = `${API_URL}/users`;

export class UsersCommandHandler {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async list(profileKey: string, parameters: UsersListParameter) {
        await this.authService.authenticate(profileKey);

        const url = buildUrl(basePath, { ...parameters });

        try {
            const { data } =
                await axios.get<PaginatedListResponse<UserDTO>>(url);

            console.log(data);

            printPaginatedList(data, 'Users Response');
        } catch (err) {
            console.log(
                chalk.red('Request to get users list failed'),
                (err as AxiosError).response,
            );
        }
    }

    async create(profileKey: string) {
        await this.authService.authenticate(profileKey);

        chalk.blue.bold('--> Create users');
        chalk.blue('Authenticated with profile: ', profileKey);
        chalk.blue('Users to create: ', usersCreate.length);

        const usersPayloads = [];
        for (const userJsonObj of usersCreate) {
            const payload = await constructPayloadObj(userJsonObj);
            usersPayloads.push(payload);
        }

        try {
            const results = await Promise.allSettled(
                usersPayloads.map((payload) => {
                    return axios.post(basePath, payload);
                }),
            );

            console.log('');
            console.log(chalk.green('Results:'));

            for (let i = 0; i < usersPayloads.length; i++) {
                const result = results[i];
                console.log(`${i + 1}: ${results[i]?.status}`);
                if (result?.status === 'rejected') {
                    console.log(result.reason.response.data);
                }
            }
        } catch {}
    }
}
