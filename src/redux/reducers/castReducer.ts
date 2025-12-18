import { PayloadAction, State } from "../store";
import { CastType, ShowType } from "../types";
import { normalize, schema } from "normalizr";
import {
  loadShowDetailsAction,
  showsLoadedAction,
} from "../actions/showActions";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const castAdapter = createEntityAdapter<CastType>();

export const initialCastState = castAdapter.getInitialState({
  loading: false,
});

const castSchema = new schema.Entity("cast");
const showSchema = new schema.Entity("shows", { cast: [castSchema] });

const castSlice = createSlice({
  name: "cast",
  initialState: initialCastState,
  reducers: {
    addCast: castAdapter.addOne,
    addCasts: castAdapter.addMany,
    upsertCast: castAdapter.upsertOne,
    upsertCasts: castAdapter.upsertMany,
    removeCast: castAdapter.removeOne,
    removeCasts: castAdapter.removeMany,
    updateCast: castAdapter.updateOne,
    updateCasts: castAdapter.updateMany,
    castLoaded: (
      state,
      action: PayloadAction<{ id: number; cast: CastType[] }>,
    ) => {
      const { cast } = action.payload;

      castAdapter.addMany(state, cast);
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(showsLoadedAction, (state, action) => {
      const shows_loaded = action.payload as ShowType[];

      const normalizedShowData =
        normalize(shows_loaded, [showSchema]).entities.cast ?? {};

      castAdapter.addMany(state, normalizedShowData);
    });
    builder.addCase(loadShowDetailsAction, (state) => {
      state.loading = false;
    });
  },
});

export const { castLoaded } = castSlice.actions;

export const {
  selectAll: selectAllCasts,
  selectById: selectCastById,
  selectEntities: selectCast,
} = castAdapter.getSelectors((state: State) => state.cast);

export default castSlice.reducer;
