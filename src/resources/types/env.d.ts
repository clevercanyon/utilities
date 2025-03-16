/**
 * Types.
 */

interface Window {
    env: { [x: string]: unknown };
}
declare var env: { [x: string]: unknown };

interface Navigator {
    globalPrivacyControl: string;
}
declare function WorkerGlobalScope(): void;
declare function DedicatedWorkerGlobalScope(): void;
declare function SharedWorkerGlobalScope(): void;
declare function ServiceWorkerGlobalScope(): void;
