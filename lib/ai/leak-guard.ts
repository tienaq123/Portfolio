/**
 * Holds back the last few characters of a streamed answer so a secret (the
 * prompt canary) can never be sent, not even split across two deltas.
 */
export function createLeakGuard(secret: string) {
  const keep = secret.length - 1;
  let buffer = "";
  let leaked = false;

  return {
    /** Returns the text that is safe to send now. */
    push(delta: string) {
      if (leaked) return "";
      buffer += delta;
      if (buffer.includes(secret)) {
        leaked = true;
        buffer = "";
        return "";
      }
      if (buffer.length <= keep) return "";
      const safe = buffer.slice(0, buffer.length - keep);
      buffer = buffer.slice(buffer.length - keep);
      return safe;
    },
    /** The held-back tail, once the answer is complete. */
    flush() {
      const rest = leaked ? "" : buffer;
      buffer = "";
      return rest;
    },
    get leaked() {
      return leaked;
    },
  };
}
