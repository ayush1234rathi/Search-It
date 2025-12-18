import axios from "axios";

export async function searchShowsAPI(search: string) {
  const response = await axios.get(
    "https://api.tvmaze.com/search/shows?q=" + search,
  );
  const data = response.data;
  //get cast for all
  const castPromises = data.map(async (show: any) => {
    const castResponse = axios.get(
      `https://api.tvmaze.com/shows/${show.show.id}?embed=cast`,
    );
    return castResponse;
  });
  const castData = await Promise.all(castPromises);
  const castDataParsed = castData.map((castResponse) => castResponse.data);
  const showsWithCast = castDataParsed.map((cast, index) => {
    return { ...data[index], cast: cast._embedded.cast };
  });

  return showsWithCast;
  // return response.data;
}

export async function getShowAPI(id: number) {
  const response = await axios.get(
    `https://api.tvmaze.com/shows/${id}?embed=cast`,
  );
  return response.data;
}

export async function getCastAPI(id: number) {
  const response = await axios.get(`https://api.tvmaze.com/shows/${id}/cast`);
  return response.data;
}
