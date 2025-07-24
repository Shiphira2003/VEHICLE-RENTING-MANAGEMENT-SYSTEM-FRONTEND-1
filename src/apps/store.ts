
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from "../features/auth/authSlice"


import { userApi } from '../features/api/userApi';
import { bookingsApi } from './../features/api/bookingsApi';
import { ticketsApi } from './../features/api/ticketsApi';
import { paymentsApi } from './../features/api/paymentsApi';
import { vehicleApi } from '../features/api/vehiclesApi';
import { locationsApi } from '../features/api/locationApi';
import { vehicleSpecsApi } from '../features/api/vehicleSpecsApi';



// Create a persist config for the auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated', 'role'], // Specify which parts of the state to persist
};

// Create a persisted reducer for the auth slice
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);


export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [bookingsApi.reducerPath]: bookingsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [ticketsApi.reducerPath]: ticketsApi.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
    [vehicleSpecsApi.reducerPath]: vehicleSpecsApi.reducer,

    // Use the persisted reducer here
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // To avoid serialization errors with redux-persist
    }).concat(userApi.middleware, bookingsApi.middleware, paymentsApi.middleware, ticketsApi.middleware, vehicleApi.middleware, locationsApi.middleware, vehicleSpecsApi.middleware),
});

// Export the persisted store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;