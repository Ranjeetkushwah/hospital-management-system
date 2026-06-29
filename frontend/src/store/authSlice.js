import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper functions for dual-token persistence (localStorage and cookies)
const setToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (e) {
    console.warn('localStorage writing blocked:', e);
  }
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
};

const getToken = () => {
  let token = null;
  try {
    token = localStorage.getItem('token');
  } catch (e) {
    console.warn('localStorage reading blocked:', e);
  }
  
  if (!token) {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        token = c.substring(name.length, c.length);
        break;
      }
    }
  }
  return token;
};

const removeToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (e) {
    console.warn('localStorage removal blocked:', e);
  }
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
};

// Axios default header helper
const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token, user } = response.data;
      setToken(token);
      setAuthHeader(token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      setToken(token);
      setAuthHeader(token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    const token = getToken();
    if (!token) {
      return rejectWithValue('No token found');
    }
    
    setAuthHeader(token);
    try {
      const response = await axios.get('/api/auth/me');
      return { token, user: response.data };
    } catch (error) {
      removeToken();
      setAuthHeader(null);
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

const initialToken = getToken();
if (initialToken) {
  setAuthHeader(initialToken);
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: initialToken,
    loading: !!initialToken, // Only load initially if a token exists
    error: null
  },
  reducers: {
    logoutUser: (state) => {
      removeToken();
      setAuthHeader(null);
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });
  }
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
