import { PayloadAction, State } from "../store";
import { shows_cast, ShowType } from "../types";
import { normalize, schema } from "normalizr";
import { castLoadedAction } from "../actions/castActions";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export type ShowState = {
  search_entities: { [key: string]: { id: number; score: number }[] };
  shows_loading: { [key: string]: { loading: boolean; caching: boolean } };
  loading: boolean;
  shows_cast: shows_cast;
  search: string;
};

const showAdapter = createEntityAdapter<ShowType>();

export const initialShowState = showAdapter.getInitialState({
  search_entities: {} as { [key: string]: { id: number; score: number }[] },
  shows_loading: {} as {
    [key: string]: { loading: boolean; caching: boolean };
  },
  loading: false,
  shows_cast: {} as shows_cast,
  search: "",
});

const castSchema = new schema.Entity("cast");
const showSchema = new schema.Entity("shows", { cast: [castSchema] });

const showSlice = createSlice({
  name: "show",
  initialState: initialShowState,
  reducers: {
    addShow: showAdapter.addOne,
    addShows: showAdapter.addMany,
    upsertShow: showAdapter.upsertOne,
    upsertShows: showAdapter.upsertMany,
    removeShow: showAdapter.removeOne,
    removeShows: showAdapter.removeMany,
    updateShow: showAdapter.updateOne,
    updateShows: showAdapter.updateMany,
    loadShows: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      if (!state.search_entities[action.payload]) state.loading = true;
    },
    showsLoaded: (state, action: PayloadAction<ShowType[]>) => {
      const normalizedShowData =
        normalize(action.payload, [showSchema]).entities.shows ?? {};
      const castRelations = Object.keys(normalizedShowData).reduce(
        (acc: any, id: string) => {
          acc[id] = normalizedShowData[id].cast;
          return acc;
        },
        {},
      );
      showAdapter.addMany(state, action.payload);
      state.shows_cast = { ...state.shows_cast, ...castRelations };
      state.search_entities[state.search] = Object.keys(normalizedShowData).map(
        (key) => ({
          id: parseInt(key),
          score: normalizedShowData[parseInt(key)].score,
        }),
      );
      state.loading = false;
    },
    loadShowDetails: (state, action: PayloadAction<number>) => {
      if (!state.entities[action.payload])
        state.shows_loading[action.payload] = { loading: true, caching: true };
      else
        state.shows_loading[action.payload] = { loading: false, caching: true };
      state.shows_loading[action.payload] = { loading: false, caching: true };
    },
    showDetailsLoaded: (state, action: PayloadAction<ShowType>) => {
      const normalizedShowDetails =
        normalize(action.payload, showSchema).entities.shows ?? {};
      const castRelation = normalizedShowDetails[action.payload.id].cast;
      delete normalizedShowDetails[action.payload.id].cast;
      showAdapter.upsertOne(state, normalizedShowDetails[action.payload.id]);
      state.shows_cast[action.payload.id] = castRelation;
      state.shows_loading[action.payload.id] = {
        loading: false,
        caching: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(castLoadedAction, (state, action) => {
      const { id, cast } = action.payload;
      state.shows_cast[id] = cast.map((actor) => actor.id);
      state.loading = false;
    });
  },
});

export const { loadShows, showsLoaded, loadShowDetails, showDetailsLoaded } =
  showSlice.actions;

export const {
  selectAll: selectAllShows,
  selectById: selectShow,
  selectEntities: selectShows,
} = showAdapter.getSelectors((state: State) => state.show);

export default showSlice.reducer;
