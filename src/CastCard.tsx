import ProgressiveImage from "react-progressive-graceful-image";
import { CastType } from "./redux/types";
import { FC } from "react";
import placeholder from "./assets/placeholder.jpg";

const CastCard: FC<CastType> = ({ name, image, thumbnail }) => {
  return (
    <div className="h-full w-36 hover:scale-110 flex flex-col">
      <ProgressiveImage src={image} placeholder={thumbnail}>
        {(src) => (
          <img
            className="w-34 h-52 object-cover object-center"
            src={src ?? placeholder}
            alt={name}
          />
        )}
      </ProgressiveImage>
      <h2 className="truncate">{name}</h2>
    </div>
  );
};

export default CastCard;
