// Vitest runs outside Next.js: `use cache` is inert there, and these become
// no-ops instead of throwing outside a cache scope.
export function cacheLife(): void {}
export function cacheTag(): void {}
export function revalidateTag(): void {}
