import { CastType } from "../types";
import { createAction } from "@reduxjs/toolkit";

export const CAST_LOADED = "cast/castLoaded";

export const castLoadedAction = createAction<{ id: number; cast: CastType[] }>(
  CAST_LOADED,
);
