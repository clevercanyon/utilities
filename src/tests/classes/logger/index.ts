/**
 * Test suite.
 */

import { $class } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('Logger', async () => {
    const Logger = $class.getLogger(),
        logger = new Logger();

    test('.log()', async () => {
        expect(logger.log('Test logger.log().') instanceof Promise).toBe(true);
    });
    test('.debug()', async () => {
        void logger.debug('Test logger.debug().');
    });
    test('.info()', async () => {
        void logger.info('Test logger.info().');
    });
    test('.warn()', async () => {
        void logger.warn('Test logger.warn().');
    });
    test('.error()', async () => {
        void logger.error('Test logger.error().');
    });
    test('.flush()', async () => {
        await expect(logger.flush()).resolves.toBe(logger.endpointToken ? true : false);
    });
    test('.withContext()', async () => {
        let promises = []; // Initialize.

        const withContext = logger.withContext({ withContext: true }),
            withSubcontext = withContext.withContext({ withSubcontext: true });

        promises.push(withContext.log('Test withContext.log().')),
            promises.push(withContext.debug('Test withContext.debug().')),
            promises.push(withContext.info('Test withContext.info().')),
            promises.push(withContext.warn('Test withContext.warn().')),
            promises.push(withContext.error('Test withContext.error().'));
        await expect(withContext.flush()).resolves.toBe(logger.endpointToken ? true : false);

        promises.push(withSubcontext.log('Test withSubcontext.log().')),
            promises.push(withSubcontext.debug('Test withSubcontext.debug().')),
            promises.push(withSubcontext.info('Test withSubcontext.info().')),
            promises.push(withSubcontext.warn('Test withSubcontext.warn().')),
            promises.push(withSubcontext.error('Test withSubcontext.error().'));
        await expect(withSubcontext.flush()).resolves.toBe(logger.endpointToken ? true : false);

        for (const promise of promises) {
            await expect(promise).resolves.toBe(logger.endpointToken ? true : false);
        }
    });
});
