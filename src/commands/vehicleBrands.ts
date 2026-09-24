import type { Command } from 'commander';
import { VehicleBrandsCommandHandler } from '../vehicle_brands/VehicleBrandsCommandHandler';

const vehicleBrandsHandler = new VehicleBrandsCommandHandler();

export function registerVehicleBrandsCommander(program: Command) {
    program
        .command('brands:list')
        .summary('List vehicle brands')
        .description('List vehicle brands paginated')
        .option('-f, --filter <ALL|ONLY_DELETED|ONLY_ACTIVE>', 'Filter results by status')
        .action((options) => {
            const globalOptions = program.opts();
            vehicleBrandsHandler.list(globalOptions.profile, options.filter);
        });

    program
        .command('brands:create')
        .summary('Create new vehicle brand - Only SUPER ADMIN')
        .description('Create brands from vehicleBrandsCreate.json')
        .action(() => {
            const globalOptions = program.opts();
            vehicleBrandsHandler.create(globalOptions.profile);
        });

    return program;
}