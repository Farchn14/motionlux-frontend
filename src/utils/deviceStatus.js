export const getDeviceOfflineSeconds = () => {
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env ? process.env : {});
  const envVal = Number(
    env.DEVICE_OFFLINE_SECONDS ||
    env.VITE_DEVICE_OFFLINE_SECONDS
  );
  return Number.isFinite(envVal) && envVal > 0 ? envVal : 5;
};


export function isLampOnline(lamp, defaultOfflineSeconds = getDeviceOfflineSeconds()) {
  if (!lamp) return false;
  if (!lamp.last_seen_at) return lamp.status === 'online';
  const lastSeen = new Date(lamp.last_seen_at).getTime();
  if (Number.isNaN(lastSeen)) return lamp.status === 'online';
  const diffSeconds = (Date.now() - lastSeen) / 1000;
  const timeoutSeconds = Number(lamp.offline_seconds) || defaultOfflineSeconds;
  return diffSeconds <= timeoutSeconds;
}

export function normalizeLampStatus(lamp, defaultOfflineSeconds = getDeviceOfflineSeconds()) {
  if (!lamp) return lamp;
  return {
    ...lamp,
    status: isLampOnline(lamp, defaultOfflineSeconds) ? 'online' : 'offline'
  };
}
