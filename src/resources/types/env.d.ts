/**
 * Defines types for environments.
 */
interface Navigator {
    globalPrivacyControl: string;
}
declare const MINIFLARE: boolean;
declare function WorkerGlobalScope(): void;
declare function DedicatedWorkerGlobalScope(): void;
declare function SharedWorkerGlobalScope(): void;
declare function ServiceWorkerGlobalScope(): void;
