import { defineStore } from "pinia";

const safeParseUser = (value) => {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    localStorage.removeItem('user');
    return null;
  }
};

const readAuthFromStorage = () => {
  const user = safeParseUser(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!user || !token) {
    return {
      user: null,
      token: null,
      refreshToken: null,
    };
  }

  return {
    user,
    token,
    refreshToken,
  };
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    ...readAuthFromStorage(),
  }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    login(user, token, refreshToken){
      this.user = user;
      this.token = token;
      this.refreshToken = refreshToken;
      localStorage.setItem('user',JSON.stringify(user))
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
    },
    logout(){
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    loadUserFromStorage(){
      const auth = readAuthFromStorage();
      this.user = auth.user;
      this.token = auth.token;
      this.refreshToken = auth.refreshToken;
    },
    updateUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
});
