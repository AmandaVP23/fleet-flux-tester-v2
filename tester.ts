#!/usr/bin/env bun

import { Command } from 'commander';
import { registerAuthCommander } from './src/commands/auth';
import { registerOrganizationsCommander } from './src/commands/organizations';
import { registerUsersCommander } from './src/commands/users';
import { registerVehicleBrandsCommander } from './src/commands/vehicleBrands';
import { registerVehiclesCommander } from './src/commands/vehicles';
import { registerVehicleDriverAssingmentsCommander } from './src/commands/vehiclesDriversAssignment';
import { setupAxiosInterceptor } from './src/utils/axiosInstance';

setupAxiosInterceptor();

const program = new Command();

program
    .name('seeder')
    .description('CLI to help test the FleetFlux API.')
    .option(
        '-p, --profile <profile>',
        'user profile (get from data/profile.json)',
        'superadmin',
    );

program.configureHelp({
    showGlobalOptions: true,
});

registerAuthCommander(program);
registerOrganizationsCommander(program);
registerUsersCommander(program);
registerVehicleBrandsCommander(program);
registerVehiclesCommander(program);
registerVehicleDriverAssingmentsCommander(program);

program.parse();
