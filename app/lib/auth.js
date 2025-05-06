export const isLoggedIn = () => typeof window !== 'undefined' && !!localStorage.getItem('token');
export const getToken = () => typeof window !== 'undefined' && localStorage.getItem('token');
