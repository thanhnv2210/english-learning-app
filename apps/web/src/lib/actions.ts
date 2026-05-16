/**
 * Shared result type for server actions.
 * New actions should return ActionResult<T> instead of throwing.
 * Existing actions are migrated when next touched — not all at once.
 *
 * Usage:
 *   export async function myAction(): Promise<ActionResult<MyData>> {
 *     try {
 *       const data = await doWork()
 *       return { ok: true, data }
 *     } catch (err) {
 *       return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' }
 *     }
 *   }
 */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string }
