import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async login
export const loginUser = createAsyncThunk("auth/login", async ({ username, password }, thunkAPI) => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", { username, password });
    localStorage.setItem("token", res.data.token);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// Async register
export const registerUser = createAsyncThunk("auth/register", async ({ username, password }, thunkAPI) => {
  try {
    await axios.post("http://localhost:5000/api/auth/register", { username, password });
    return "success";
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
