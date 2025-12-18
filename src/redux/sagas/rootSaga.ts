import { call, debounce, put, takeLatest } from "redux-saga/effects";
import { LOAD_SHOW_DETAILS, LOAD_SHOWS } from "../actions/showActions";
import { PayloadAction } from "../store";
import { getCastAPI, getShowAPI, searchShowsAPI } from "../../api";
import { CastType, ShowType } from "../types";
import { showDetailsLoaded, showsLoaded } from "../reducers/showReducer";
import { castLoaded } from "../reducers/castReducer";

export default function* rootSaga() {
  yield debounce(300, LOAD_SHOWS, fetchShow);
  yield takeLatest(LOAD_SHOW_DETAILS, fetchShowDetails);
}

function* fetchShow(
  action: PayloadAction<string>,
): Generator<any, any, unknown> {
  try {
    const res: any = yield call(searchShowsAPI, action.payload);
    const shows: ShowType[] = res.map((show: any) => ({
      id: show.show.id,
      name: show.show.name,
      genres: show.show.genres,
      thumbnail: show.show.image?.medium,
      image: show.show.image?.original,
      summary: show.show.summary,
      rating: show.show.rating.average,
      score: show.score,
      cast: show.cast.map((actor: any) => ({
        id: actor.person.id,
        name: actor.person.name,
        thumbnail: actor.person.image?.medium,
        image: actor.person.image?.original,
      })),
    }));

    yield put(showsLoaded(shows));
  } catch (e) {
    console.log(e);
  }
}

function* fetchShowDetails(
  action: PayloadAction<number>,
): Generator<any, any, unknown> {
  try {
    const res1: any = yield call(getShowAPI, action.payload);
    const show: ShowType = {
      ...res1,
      thumbnail: res1.image?.medium,
      image: res1.image?.original,
      rating: res1.rating.average,
      cast: res1._embedded.cast.map((actor: any) => ({
        id: actor.person.id,
        name: actor.person.name,
        thumbnail: actor.person.image?.medium,
        image: actor.person.image?.original,
      })),
    };
    const res2: any = yield call(getCastAPI, action.payload);
    const cast: CastType[] = res2.map((actor: any) => ({
      id: actor.person.id,
      name: actor.person.name,
      thumbnail: actor.person.image?.medium,
      image: actor.person.image?.original,
    }));
    yield put(showDetailsLoaded(show));
    yield put(castLoaded({ id: action.payload, cast }));
  } catch (e) {
    console.log(e);
  }
}
