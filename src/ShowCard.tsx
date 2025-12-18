import ProgressiveImage from "react-progressive-graceful-image";
import { CastType, ShowType } from "./redux/types";
import { FC, useState } from "react";
import placeholder from "./assets/placeholder.jpg";
import { Link } from "react-router-dom";
import { selectMapCasts } from "./redux/selectors/castSelector";
import { State } from "./redux/store";
import { connect } from "react-redux";

type ReduxProps = ReturnType<typeof mapStateToProps>;

const ShowCard: FC<ShowType & ReduxProps> = ({
  id,
  name,
  summary,
  image,
  thumbnail,
  castMap,
}) => {
  const [open, setOpen] = useState(false);
  const data = castMap.slice(0, 5).map((d, i) => ({
    key: i,
    src: d.image ?? placeholder,
    name: d.name,
  }));
  return (
    <div className="h-full flex flex-col hover:scale-105">
      <ProgressiveImage src={image} placeholder={thumbnail}>
        {(src) => (
          <img
            className="h-[30rem] w-full object-cover object-center"
            src={src ?? placeholder}
            alt={name}
          />
        )}
      </ProgressiveImage>
      <h2 className="text-3xl font-bold p-4">{name}</h2>
      <p
        dangerouslySetInnerHTML={{ __html: summary }}
        className="my-2 mx-4 grow max-h-72 overflow-clip"
      ></p>
      <div className="grow m-3 flex items-end relative w-max">
        {data.map((d) => (
          <HoverButton key={d.key} img={d.src} name={d.name} />
        ))}

        {castMap.length > 5 && (
          <button
            onClick={() => setOpen((prev) => !prev)}
            onMouseLeave={() => setOpen(false)}
            className="h-12 w-12 rounded-full object-cover object-center border-2 border-white -ml-2 shadow-lg z-10 hover:z-20 hover:scale-110 transition-transform duration-300 hover:border-blue-600 bg-white"
          >
            {castMap.length - 5}+
          </button>
        )}
        {open && <CastList castMap={castMap.slice(5)} setOpen={setOpen} />}
      </div>
      <Link
        to={`/show/${id}`}
        className="font-bold  text-xl p-3 m-4 text-center block border-2 border-gray-700 hover:bg-gray-700 hover:text-white transition-colors duration-300"
      >
        View Details
      </Link>
    </div>
  );
};

function mapStateToProps(state: State, ownProps: ShowType) {
  return {
    castMap: selectMapCasts(ownProps.id)(state),
  };
}

export default connect(mapStateToProps)(ShowCard);

const CastList: FC<{
  castMap: CastType[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ castMap, setOpen }) => {
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="bg-white rounded-md h-max max-h-80 overflow-scroll absolute p-4 bottom-10 right-0 z-30 border border-gray-500"
    >
      {castMap?.map((actor) => (
        <div key={actor.id} className="flex items-center gap-4 py-2">
          <img
            src={actor.image ?? placeholder}
            className="h-12 w-12 rounded-full object-cover object-center border-2 border-white shadow-lg "
          />{" "}
          <p>{actor.name}</p>
        </div>
      ))}
    </div>
  );
};

const HoverButton: FC<{ img: string; name: string }> = ({ img, name }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <img
        src={img}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="h-12 w-14 rounded-full object-cover object-center border-2 border-white -ml-2 shadow-lg z-10 hover:z-20 hover:scale-110 transition-transform duration-300 hover:border-blue-600 bg-white"
      />
      {open && (
        <div className="absolute bottom-10 -left-5 bg-white p-2 rounded-full w-max border-2 border-gray-500 z-30">
          {name}
        </div>
      )}
    </div>
  );
};
