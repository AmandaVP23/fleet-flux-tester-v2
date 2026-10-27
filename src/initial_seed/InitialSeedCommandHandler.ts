import axios, { isAxiosError } from 'axios';
import chalk from 'chalk';
import { AuthService } from '../auth/authService';
import initialDataJson from '../data/initialData.json';
import { BaseEndpoints } from '../endpoints';
import type { OrganizationDTO } from '../organizations/types';
import type { UserDTO } from '../users/types';
import { buildUrl } from '../utils/buildUrl';
import type { PaginatedListResponse } from '../utils/types';

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
        
        console.log(chalk.yellow.bold('########## Initial Seed ##########'));
        
        this.createVehicleBrands();
        
        console.log();

        for (const data of initialDataJson.data) {
            const organization = await this.createOrganization(data.organization);
            
            if (!organization) {
                console.log(chalk.red.bold("Problem creating or getting organization"));
                return;
            }
            await this.createUsers(organization, data.users);
            await this.createVehicles(organization, data.vehicles);
        }
    }

    async createOrganization(orgData: Record<string, string | number | object>): Promise<OrganizationDTO | null> {
        chalk.green.bold('---> Creating organization: ', orgData.name);

        try {
            const { data } = await axios.post<OrganizationDTO>(BaseEndpoints.Organizations, orgData);
            console.log(chalk.green(`Created organization ${data.name} [#${data.id}]`));
            return data;
        } catch (e) {
            console.log(isAxiosError(e) && e.response?.status)
            if (isAxiosError(e) && e.response?.status === 409) {
                try {
                    console.log('Organization conflict. Trying to get the existing organization');
                    const { data } = await axios.get<PaginatedListResponse<OrganizationDTO>>(buildUrl(BaseEndpoints.Organizations, { size: 100 }));
                    const [org] = data.items.filter((o) => o.name.toLocaleLowerCase() === (orgData.name as string).toLocaleLowerCase());
                    return org || null; 
                } catch (e) {
                    console.log(e);
                }
            }
            return null;
        }
    }

    async createUsers(organization: OrganizationDTO, usersData: object[]) {
        console.log(chalk.green.bold(`---> Creating users for org unit ${organization.name} (#${organization.id})`));
        
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
                console.log(chalk.green(`User: ${createdUser.firstName} ${createdUser.lastName} created [#${createdUser.id}]`));
            }
        }
    }
    
    async createVehicleBrands() {
        console.log(chalk.green.bold('---> Creating vehicle brands'));
        
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
                console.log(chalk.green(`Brand: ${payloads[i]?.name} created [#${result.value.data.id}]`));
                this.vehicleBrandsIds.push(result.value.data.id);
            }
        }
    }

    async createVehicles(organization: OrganizationDTO, vehiclesData: object[]) {
        console.log(chalk.green.bold(`---> Creating vehicles for org unit ${organization.name} (#${organization.id})`));

        const payloads = vehiclesData.map((vehicleData) => ({
            ...vehicleData,
            organizationId: organization.id,
            brandId: this.getRandomVehicleBrandId(),
        }));

        const results = await Promise.allSettled(
            payloads.map((p) => {
                return axios.post(BaseEndpoints.Vehicles, p);
            }),
        );

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result?.status === 'rejected') {
                console.log(result.reason.response.data);
            } else if (result?.status === 'fulfilled') {
                const createdVehicle = result.value.data as { id: number, plateNumber: string };
                console.log(chalk.green(`Vehicle created: ${createdVehicle.plateNumber} created [#${createdVehicle.id}]`));
            }
        }
    }

    private getRandomVehicleBrandId() {
        return this.vehicleBrandsIds[Math.floor(Math.random() * this.vehicleBrandsIds.length)];
    }
}
