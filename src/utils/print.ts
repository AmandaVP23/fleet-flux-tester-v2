import chalk from 'chalk';
import type { PaginatedListResponse } from './types';

function keys<T extends object>(obj: T) {
    return Object.keys(obj) as Array<keyof T>;
}

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

        const objKeys = Object.keys(obj);

        objKeys.forEach((key) => {
            console.log(`${chalk.bold(key)}: ${obj[key]}`);
        });

        if (i < list.length - 1) {
            console.log('--------------');
        }
    }
}
