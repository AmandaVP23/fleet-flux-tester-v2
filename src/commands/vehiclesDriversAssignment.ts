import type { Command } from 'commander';
import { VehicleDriverAssignmentsCommandHandler } from '../vehicle_driver_assigments/VehicleDriverAssignmentsCommandHandler';

const vehicleDriverAssignmentHandler =
    new VehicleDriverAssignmentsCommandHandler();

export function registerVehicleDriverAssingmentsCommander(program: Command) {
    program
        .command('vehicle-driver:list')
        .summary('List vehicle driver assignments')
        .description('List vehicles paginated')
        .description('SuperAdmin should sent organizationId.')
        .option(
            '-d, --direction <asc|desc>',
            'results sort direction asc or desc - default: asc',
        )
        .option('--driverId <number>', 'Filter results by driver')
        .option('-v, --vehicleId <number>', 'Filter results by vehicle')
        .option(
            '-o, --organizationId <number>',
            'Filter results by organization (Only SUPERADMIN)',
        )
        .option('-p, --page <number>', 'Pagination page value (starts at 0)')
        .option('-s, --size <number>', 'Pagination page size value ')
        .option('--sb, --sortBy <string>', 'Sort by value')
        .action((options) => {
            const globalOptions = program.opts();
            vehicleDriverAssignmentHandler.list(globalOptions.profile, {
                page: options.page ? Number(options.page) : null,
                size: options.size ? Number(options.size) : null,
                sortBy: options.sortBy || null,
                direction: options.direction || null,
                organizationId: options.organizationId || null,
                driverId: options.driverId || null,
                vehicleId: options.vehicleId || null,
            });
        });

    program
        .command('vehicle-driver:create')
        .summary('Create new vehicle driver assignment')
        .description('Create vehicle from vehicleDriverAssignmentCreate.json')
        .action(() => {
            const globalOptions = program.opts();
            vehicleDriverAssignmentHandler.create(globalOptions.profile);
        });

    return program;
}
