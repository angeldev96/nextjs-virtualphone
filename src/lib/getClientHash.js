// Minimal client-side clientHash helper.
// - Generates a UUID (once) stored in cookie + localStorage
// - Computes SHA-256 of that UUID and returns it as hex
// - Safe to use in browser environments (uses crypto.subtle)

export async function sha256(input) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const COOKIE = 'yj_client_id';

export async function getClientHash() {
  // try cookie then localStorage
  try {
    let clientId =
      (typeof document !== 'undefined' && document.cookie.match(/(?:^|; )yj_client_id=([^;]+)/)?.[1]) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem(COOKIE));

    if (!clientId) {
      if (typeof crypto?.randomUUID === 'function') {
        clientId = crypto.randomUUID();
      } else {
        // fallback UUID v4-like
        clientId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }

      if (typeof localStorage !== 'undefined') localStorage.setItem(COOKIE, clientId);
      if (typeof document !== 'undefined') {
        // set cookie for ~400 days
        document.cookie = `${COOKIE}=${encodeURIComponent(clientId)}; Path=/; Max-Age=${60 * 60 * 24 * 400}`;
      }
    }

    return await sha256(clientId);
  } catch (err) {
    // in case of any failure, return a simple fallback (non-cryptographic)
    const fallback = String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    return await sha256(fallback);
  }
}
