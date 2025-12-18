import { connect } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import {
  selectCachingID,
  selectLoadingID,
} from "./redux/selectors/showSelectors";
import { FC, useEffect } from "react";
import Loading, { Spinner } from "./Loading";
import {
  selectCastLoading,
  selectMapCasts,
} from "./redux/selectors/castSelector";
import { State } from "./redux/store";
import withRouter, { WithRouterProps } from "./withRouter";
import ProgressiveImage from "react-progressive-graceful-image";
import placeholder from "./assets/placeholder.jpg";
import CastCard from "./CastCard";
import { loadShowDetails, selectShow } from "./redux/reducers/showReducer";

type ReduxProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnProps = {};

const ShowPage: FC<OwnProps & WithRouterProps & ReduxProps> = ({
  params,
  show,
  loadingID,
  cachingID,
  castMap,
  castLoading,
  loadShowDetails,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    loadShowDetails(+params.id!);
  }, [params.id]);

  return loadingID ? (
    <Loading />
  ) : (
    <div className="my-2 max-w-5xl bg-white p-4 mx-auto">
      <Link to=".." className="flex items-center text-xl gap-2">
        <IoMdArrowRoundBack className="h-full" />
        <h3>Back</h3>
      </Link>
      <div className="flex gap-4">
        <h1 className="text-4xl font-bold my-4">{show?.name}</h1>
        {cachingID && <Spinner />}
      </div>
      <ul className="bg-gray-300 text-black font-bold text-xl flex gap-4 p-3 flex-wrap">
        {show?.genres.map((genre) => <li key={genre}>{genre}</li>)}
      </ul>
      <div className="flex gap-4 my-4 flex-col sm:flex-row">
        <ProgressiveImage src={show?.image ?? ""} placeholder={show?.thumbnail}>
          {(src) => (
            <img
              src={src ?? placeholder}
              alt={show?.name}
              className="sm:w-1/2 hover:scale-110 sm:min-w-80 max-h-[40rem] object-contain"
            />
          )}
        </ProgressiveImage>
        <div className="w-full">
          <p
            className="sm:text-xl my-4"
            dangerouslySetInnerHTML={{ __html: show?.summary ?? "" }}
          ></p>
          {show?.rating && (
            <h3 className="text-2xl border-2 border-gray-500 rounded-xl p-2 my-4 w-max">
              <span className="font-bold mr-1">Rating:</span>
              {show?.rating}/10
            </h3>
          )}
        </div>
      </div>
      {castLoading ? (
        <Loading />
      ) : (
        <>
          <h2 className="text-4xl font-bold my-4">Cast</h2>
          <div className="flex gap-4 flex-wrap ">
            {castMap?.map((actor) => <CastCard key={actor.id} {...actor} />)}
            {castMap.length === 0 && (
              <p className="text-2xl">No cast found...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

function mapStateToProps(state: State, ownProps: WithRouterProps) {
  return {
    show: selectShow(state, +ownProps.params.id!),
    loadingID: selectLoadingID(+ownProps.params.id!)(state),
    cachingID: selectCachingID(+ownProps.params.id!)(state),
    castMap: selectMapCasts(+ownProps.params.id!)(state),
    castLoading: selectCastLoading()(state),
  };
}

const mapDispatchToProps = {
  loadShowDetails,
};

export default withRouter<OwnProps & WithRouterProps>(
  connect(mapStateToProps, mapDispatchToProps)(ShowPage),
);
