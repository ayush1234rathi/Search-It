import { createSelector } from "reselect";
import { State } from "../store";
import { ShowNormalizedType, ShowType } from "../types";
import { selectShows } from "../reducers/showReducer";

export const selectSearch = () => (state: State) => state.show.search;

export const selectSearchEntities = () => (state: State) =>
  state.show.search_entities;

export const selectLoadingID = (id: number) => (state: State) =>
  state.show.shows_loading[id]?.loading;

export const selectCachingID = (id: number) => (state: State) =>
  state.show.shows_loading[id]?.caching;

export const selectShowsLoading = () => (state: State) => state.show.loading;

export const selectShowCast = (id: number) => (state: State) =>
  state.show.shows_cast[id];

export const selectMapShows = () =>
  createSelector(
    [selectShows, selectSearch(), selectSearchEntities()],
    (
      shows: ShowNormalizedType,
      search: string,
      search_entities: { [key: string]: { id: number; score: number }[] },
    ): ShowType[] => {
      const searchIds = [...(search_entities[search] ?? [])];
      const searchArr: ShowType[] = [];
      searchIds.sort((a, b) => b.score - a.score);
      searchIds.forEach((item) => {
        if (shows[item.id]) {
          searchArr.push(shows[item.id]);
        }
      });
      return searchArr;
    },
  );
