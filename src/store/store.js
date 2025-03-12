import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice';
import postSlice from"./postSlice";

export const store = configureStore({
    reducer:{
        auth:authSlice,
        post:postSlice,
    },
})

export default store;