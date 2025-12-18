import { createSelector } from "reselect";
import { State } from "../store";
import { CastNormalizedType, CastType } from "../types";
import { selectShowCast } from "./showSelectors";
import { selectCast } from "../reducers/castReducer";

export const selectCastLoading = () => (state: State) => state.cast.loading;

export const selectMapCasts = (id: number) =>
  createSelector(
    selectCast,
    selectShowCast(id),
    (cast: CastNormalizedType, relation: number[]): CastType[] => {
      if (!relation || !Object.keys(cast).length) return [];
      const castArray: CastType[] = [];
      relation.forEach((id) => {
        if (cast[id]) {
          castArray.push(cast[id]);
        }
      });
      const removeDuplicates = castArray.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
      );

      return removeDuplicates;
    },
  );
