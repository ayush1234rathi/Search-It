import { FC, useEffect } from "react";
import { connect } from "react-redux";
import {
  selectMapShows,
  selectSearch,
  selectShowsLoading,
} from "./redux/selectors/showSelectors";
import Loading from "./Loading";
import { State } from "./redux/store";
import withRouter, { WithRouterProps } from "./withRouter";
import { FaSearch } from "react-icons/fa";
import ShowCard from "./ShowCard";
import { loadShows } from "./redux/reducers/showReducer";

type ReduxProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnProps = {};

const Search: FC<OwnProps & ReduxProps & WithRouterProps> = ({
  shows,
  showsLoading,
  search,
  loadShows,
  searchParams,
  setSearchParams,
}) => {
  useEffect(() => {
    if (search === "") loadShows(searchParams.get("q") ?? "");
  }, []);

  useEffect(() => {
    setSearchParams({ q: search }, { replace: true });
  }, [search]);

  return (
    <div className="m-4 max-w-5xl mx-auto">
      <div className="flex relative items-center m-14 mx-auto w-11/12">
        <input
          type="text"
          value={search}
          onChange={(e) => loadShows(e.target.value)}
          placeholder="Search for your favourite shows"
          className="w-full rounded-full border-4 p-4 border-gray-700 text-xl"
        />
        <FaSearch className="absolute right-5 bg-white h-2/3 w-9 p-1 rounded-full" />
      </div>
      {showsLoading ? (
        <Loading />
      ) : (
        <>
          <div
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
            className="sm:grid gap-3 bg-white p-4 "
          >
            {search !== "" &&
              shows.map((show) => <ShowCard key={show.id} {...show} />)}
          </div>
          {(search === "" || shows.length === 0) && (
            <h1 className="text-4xl text-center bg-white pb-8">No shows found...</h1>
          )}
        </>
      )}
    </div>
  );
};

function mapStateToProps(state: State) {
  return {
    shows: selectMapShows()(state),
    showsLoading: selectShowsLoading()(state),
    search: selectSearch()(state),
  };
}

const mapDispatchToProps = {
  loadShows,
};

export default withRouter<OwnProps & WithRouterProps>(
  connect(mapStateToProps, mapDispatchToProps)(Search),
);
