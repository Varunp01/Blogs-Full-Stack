import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import userReducer from "./userSlice.js";

const EXPIRY_TIME = 60 * 60 * 1000; // 1 hour

const storage = {
  getItem: async (key) => {
    const storedData = window.localStorage.getItem(key);

    if (!storedData) {
      return null;
    }

    try {
      const parsedData = JSON.parse(storedData);

      if (Date.now() > parsedData.expiresAt) {
        window.localStorage.removeItem(key);
        return null;
      }

      return parsedData.value;
    } catch (error) {
      console.error("Failed to read persisted Redux state:", error);
      window.localStorage.removeItem(key);
      return null;
    }
  },

  setItem: async (key, value) => {
    const dataWithExpiry = {
      value,
      expiresAt: Date.now() + EXPIRY_TIME,
    };

    window.localStorage.setItem(
      key,
      JSON.stringify(dataWithExpiry)
    );

    return value;
  },

  removeItem: async (key) => {
    window.localStorage.removeItem(key);
  },
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;