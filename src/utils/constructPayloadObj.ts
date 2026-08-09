import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { faker, fakerEN_GB } from '@faker-js/faker';
import chalk from 'chalk';

async function promptValue(objKey: string) {
    const rl = createInterface({ input, output });

    let value = '';

    while (value.trim() === '') {
        value = await rl.question(
            `Enter value for: ${chalk.yellow.bold(objKey)}\n`,
        );
    }

    rl.close();

    return value;
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
    return (
        value !== null &&
        (typeof value === 'object' || typeof value === 'function') &&
        typeof (value as { then?: unknown }).then === 'function'
    );
}

async function generateValue(objKey: string, objValue: string) {
    const generationMappers: Record<
        string,
        (objKey: string) => string | Promise<string>
    > = {
        ':prompt': () => promptValue(objKey),
        'random:firstName': () => fakerEN_GB.person.firstName(),
        'random:lastName': () => fakerEN_GB.person.lastName(),
        'random:email': () => fakerEN_GB.internet.email(),
    };

    const mapperFn = generationMappers[objValue];
    if (!mapperFn) {
        throw new Error(`No mapper defined for ${objValue}`);
    }

    const v = isPromiseLike(mapperFn)
        ? await mapperFn(objKey)
        : mapperFn(objKey);

    return v;
}

export async function constructPayloadObj(
    obj: Record<string, string | number>,
) {
    const entries = await Promise.all(
        Object.entries(obj).map(async ([key, value]) => {
            let v = value;

            if (v === ':prompt' || String(v).startsWith('random:')) {
                v = await generateValue(key, String(v));
            }

            return [key, v] as const;
        }),
    );

    return Object.fromEntries(entries);
}

// for (const key of Object.keys(obj)) {
//   await generateValue(...);
// }
