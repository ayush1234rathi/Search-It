import { Action } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas/rootSaga";
import showReducer, { initialShowState } from "./reducers/showReducer";
import castReducer, { initialCastState } from "./reducers/castReducer";
import { configureStore } from "@reduxjs/toolkit";

export const initialState = {
  show: initialShowState,
  cast: initialCastState,
};

export type PayloadAction<T = any> = Action & { payload: T };

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    show: showReducer,
    cast: castReducer,
  },
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

export type AppStore = typeof store;
export type State = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

sagaMiddleware.run(rootSaga);

export default store;
