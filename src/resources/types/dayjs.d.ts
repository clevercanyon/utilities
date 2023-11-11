import 'dayjs'; // Extending this below.
import { type I18nOptions } from '../../time.ts';

/**
 * Defines types for `dayjs` module.
 */
declare module 'dayjs' {
    export interface Dayjs {
        clone(): Dayjs;
        equals(x: Dayjs): boolean;

        toYMD(): string;
        toSQL(): string;
        toISO(): string;
        toHTTP(): string;

        toProse(): string;
        toProseDate(): string;

        toI18n(options?: I18nOptions): string;
        toI18nDate(options?: I18nOptions): string;
    }
}
