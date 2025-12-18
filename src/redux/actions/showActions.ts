import { ShowType } from "../types";
import { createAction } from "@reduxjs/toolkit";

export const LOAD_SHOWS = "show/loadShows";
export const SHOWS_LOADED = "show/showsLoaded";
export const LOAD_SHOW_DETAILS = "show/loadShowDetails";
export const SHOW_DETAILS_LOADED = "show/showDetailsLoaded";

export const showsLoadedAction = createAction<ShowType[]>(SHOWS_LOADED);

export const loadShowDetailsAction = createAction<number>(LOAD_SHOW_DETAILS);
