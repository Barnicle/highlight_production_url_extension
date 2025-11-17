export const normalizeHost = (input: string) => {
  let host = input.trim();
  try {
    if (host.includes('://')) host = new URL(host).hostname;
    else host = host.split('/')[0];
    host = host.split(':')[0];
  } catch {
    // fallback: use raw
  }
  return host;
};
