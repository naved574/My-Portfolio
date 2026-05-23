const USER_TOKEN_KEY = "user_token";
const ADMIN_TOKEN_KEY = "admin_token";

export const getUserToken = () => localStorage.getItem(USER_TOKEN_KEY);
export const setUserToken = (token: string) => {
  localStorage.setItem(USER_TOKEN_KEY, token);
};
export const clearUserToken = () => {
  localStorage.removeItem(USER_TOKEN_KEY);
};

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const setAdminToken = (token: string) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};
export const clearAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const clearAllTokens = () => {
  clearUserToken();
  clearAdminToken();
};
