import { Route, Routes } from "react-router-dom";

import { RoutePaths } from "./RoutePaths.jsx";
import Home from "../home/Home.jsx";
import About from "../components/About/index.jsx";
import FABToken from "../components/FABToken/index.jsx";
import { NotFound } from "./NotFound.jsx";
import { Layout } from "./Layout.jsx";

export const Router = () => (
  <Routes>
    <Route
      path={RoutePaths.HOME}
      element={
        <Layout>
          <Home />
        </Layout>
      }
    />
    <Route
      path='/about'
      element={
        <Layout>
          <About />
        </Layout>
      }
    />
    <Route
      path='/FABToken'
      element={
        <Layout>
          <FABToken />
        </Layout>
      }
    />
    <Route
      path="*"
      element={
        <Layout>
          <NotFound />
        </Layout>
      }
    />
  </Routes>
);
