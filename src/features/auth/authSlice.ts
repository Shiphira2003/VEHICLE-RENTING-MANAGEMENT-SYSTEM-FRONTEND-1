import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../../types/Types';


const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    role: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: any; token: string, role:any }>) => {
            state.user = action.payload;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.role = action.payload.role;
        },
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;