import axios, { AxiosError, isAxiosError } from 'axios';
import chalk from 'chalk';
import { AuthService } from '../auth/authService';
import initialDataJson from '../data/initialData.json';
import { BaseEndpoints } from '../endpoints';
import type { OrganizationDTO } from '../organizations/types';
import type { UserDTO } from '../users/types';

const profileKey = 'superadmin';

export class InitialSeedCommandHandler {
    private readonly authService: AuthService;
    private readonly vehicleBrandsIds: Array<number>;
    
    constructor() {
        this.authService = new AuthService();
        this.vehicleBrandsIds = [];
    }
    
    async seed() {
        await this.authService.authenticate(profileKey);
        
        chalk.blue.bold('########## Initial Seed ##########');
        
        this.createVehicleBrands();
        
        console.log();

        for (const data of initialDataJson.data) {
            const organization = await this.createOrganization(data.organization);
            
            if (!organization) {
                chalk.red.bold("Problem creating organization");
                return;
            }
            this.createUsers(organization, data.users);
        }
    }

    async createOrganization(orgData: Record<string, string | number | object>): Promise<OrganizationDTO | null> {
        chalk.green.bold('---> Creating organization: ', orgData.name);

        try {
            const { data } = await axios.post<OrganizationDTO>(BaseEndpoints.Organizations, orgData);
            chalk.green(`Created organization ${data.name} [#${data.id}]`)
            return data;
        } catch (e) {
            if (isAxiosError(e) && e.status === 409) {
                // todo - get existing org 
            }
            return null;
        }
    }
// todo - remove this any
    async createUsers(organization: OrganizationDTO, usersData: object[]) {
        chalk.green.bold(`---> Creating users for org unit ${organization.name} (#${organization.id})`);
        
        const payloads = usersData.map((userData) => ({
            ...userData,
            organizationId: organization.id,
        }));
        
        const results = await Promise.allSettled(
            payloads.map((p) => {
                return axios.post(BaseEndpoints.Users, p);
            }),
        );
        
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result?.status === 'rejected') {
                console.log(result.reason.response.data);
            } else if (result?.status === 'fulfilled') {
                const createdUser = result.value.data as UserDTO;
                chalk.green(`User: ${createdUser.firstName} ${createdUser.lastName} created [#${result.value.data.id}]`);
            }
        }
    }
    
    async createVehicleBrands() {
        chalk.green.bold('---> Creating vehicle brands');
        
        const payloads = initialDataJson.vehicleBrands.map((brandName) => ({
            name: brandName,
        }));
        
        const results = await Promise.allSettled(
            payloads.map((p) => {
                return axios.post(BaseEndpoints.VehicleBrands, p);
            }),
        );
        
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result?.status === 'rejected') {
                console.log(result.reason.response.data);
            } else if (result?.status === 'fulfilled') {
                chalk.green(`Brand: ${payloads[i]?.name} created [#${result.value.data.id}]`);
                this.vehicleBrandsIds.push(result.value.data.id);
            }
        }
    }
}
