import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./Search";
import ShowPage from "./ShowPage";
import Error404 from "./Error404";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/show/:id" element={<ShowPage />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
