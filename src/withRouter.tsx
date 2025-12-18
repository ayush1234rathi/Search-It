import React from "react";

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

export interface WithRouterProps {
  location: ReturnType<typeof useLocation>;
  params: Record<string, string>;
  navigate: ReturnType<typeof useNavigate>;
  searchParams: ReturnType<typeof useSearchParams>[0];
  setSearchParams: ReturnType<typeof useSearchParams>[1];
}

const withRouter = <Props extends WithRouterProps>(
  Component: React.ComponentType<Props>,
) => {
  return (props: Omit<Props, keyof WithRouterProps>) => {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    return (
      <Component
        {...(props as Props)}
        location={location}
        params={params}
        navigate={navigate}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    );
  };
};

export default withRouter;
