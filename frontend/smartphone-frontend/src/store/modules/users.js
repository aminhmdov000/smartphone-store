import { defineStore } from "pinia";
import {
  getUsers as getUsersRequest,
  deleteUser as deleteUserRequest,
  updateProfile as updateProfileRequest,
  getProfile as getProfileRequest
} from "../../services/userService";

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: ''
  }),
  actions: {
    async fetchUsers() {
      try {
        this.loading = true;
        this.error = '';
        const res = await getUsersRequest();
        this.users = res.data;
      } catch (error) {
        this.error = 'Failed to fetch users';
        console.error('Failed to fetch users:', error);
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(id) {
      try {
        this.loading = true;
        this.error = '';
        await deleteUserRequest(id);
        this.users = this.users.filter((user) => user.id !== id);
      } catch (error) {
        this.error = 'Failed to delete user';
        console.error('Failed to delete user:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateProfile(profileData) {
      try {
        this.loading = true;
        this.error = '';
        await updateProfileRequest(profileData);
      } catch (error) {
        this.error = 'Failed to update profile';
        console.error('Failed to update profile:', error);
        throw error;
      }
      finally{
        this.loading = false;
      }
    },
    async getProfile() {
      try {
        this.loading = true;
        this.error = '';
        const res = await getProfileRequest();
        return res.data;
      } catch (error) {
        this.error = 'Failed to fetch profile';
        console.error('Failed to fetch profile:', error);
        throw error;
      }
      finally{
        this.loading = false;
      }
    }
  }
});
