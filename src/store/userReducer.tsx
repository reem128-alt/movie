import { createSlice } from "@reduxjs/toolkit";


interface User {
  username: string;
  password:string;
  isAuthenticated: boolean;
}

interface AuthState {
  user: User;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      username: localStorage.getItem('user') || '',
      isAuthenticated: localStorage.getItem('isAuthenticated') === 'true'
    }
  },
  reducers: {
    loginUser: (state, action) => {
      if (action.payload.username === "admin" && action.payload.password === "admin"){
        state.user = {
          username: action.payload.username,
          isAuthenticated: true
        };
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', action.payload.username);
      }
      else state.user.isAuthenticated === false
     
    },
    logoutUser: (state) => {
      state.user = {
        username: '',
        isAuthenticated: false
      };
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    },
  },
});

export const {
  loginUser,
  logoutUser,
} = authSlice.actions;
export default authSlice.reducer;
