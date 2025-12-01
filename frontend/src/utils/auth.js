export function getToken() {
  return localStorage.getItem("token");
}

export function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(window.atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function isAdmin() {
  const token = getToken();
  if (!token) return false;

  const decoded = decodeToken(token);
  return decoded?.tipo === "ADMIN";
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp && decoded.exp > now;
}
export function getUserType() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payloadBase64 = token.split(".")[1];
    const jsonPayload = JSON.parse(atob(payloadBase64));

    return jsonPayload.tipo || null; // ex.: "ADMIN" ou "CLIENTE"
  } catch {
    return null;
  }
}
