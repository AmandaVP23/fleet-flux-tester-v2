import chalk from 'chalk';
import type { PaginatedListResponse } from './types';

export function printPaginatedList<T extends Record<string, unknown>>(
    paginatedRes: PaginatedListResponse<T>,
    title: string,
) {
    console.log(chalk.green.bold(title));
    console.log('');

    console.log(`${chalk.bold('Total: ')} ${paginatedRes.total}`);
    console.log(`${chalk.bold('Page: ')} ${paginatedRes.page}`);
    console.log(`${chalk.bold('Size: ')} ${paginatedRes.size}`);
    console.log('');

    printObjList(paginatedRes.items);
}

export function printObj<T extends Record<string, unknown>>(
    obj: T,
    level = 0,
) {
    const objKeys = Object.keys(obj);

    objKeys.forEach((key) => {
        if (obj[key] !== null && typeof obj[key] === 'object') {
            console.log(`${chalk.bold(key)}:`);
            printObj({ ...obj[key] }, level + 1);
        } else {
            const spaces = ' '.repeat(level * 4);
            console.log(`${spaces}${chalk.bold(key)}: ${obj[key]}`);
        }
    });
}

export function printObjList<T extends Record<string, unknown>>(
    list: T[],
    title?: string,
) {
    if (title) {
        console.log('');
        console.log(chalk.green.bold(title));
        console.log('');
    }

    for (let i = 0; i < list.length; i++) {
        const obj = list[i];
        if (!obj) {
            return;
        }

        printObj(obj);

        if (i < list.length - 1) {
            console.log('--------------');
        }
    }
}
