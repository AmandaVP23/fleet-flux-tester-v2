#!/usr/bin/env bun

import { Command } from 'commander';
import { registerAuthCommander } from './src/commands/auth';

const program = new Command();

program.name('seeder').description('CLI to help test the FleetFlux API.');

registerAuthCommander(program);

program.parse();
