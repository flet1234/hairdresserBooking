import { configureStore } from "@reduxjs/toolkit";
import adminReducer from '../features/adminSlice'
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

const store = configureStore({
    reducer:{
        adminReducer
    }
})

export type StoreStateType = ReturnType<typeof store.getState>
export type StoreDispatchType = typeof store.dispatch;

export const useAppDispatch: () => StoreDispatchType = useDispatch;

export const useAppSelector: TypedUseSelectorHook<StoreStateType> = useSelector

export default store