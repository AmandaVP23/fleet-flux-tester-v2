#!/usr/bin/env bun

import { Command } from 'commander';
import { registerAuthCommander } from './src/commands/auth';
import { registerOrganizationsCommander } from './src/commands/organizations';
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

program.parse();
