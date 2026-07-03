import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Signin from "./components/sign-in/Signin";
import Signup from "./components/sign-up/Signup";
import { AppUrls } from "./AppUrls";
import Tasks from "./components/tasks/Tasks";
// import NotFoundPage from "./pages/nonFoundPage/NotFoundPage";

const AppRoutes = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path={AppUrls.Client.Home} element={<Home />} />
          <Route path={AppUrls.Client.Register} element={<Signup />} />
          <Route path={AppUrls.Client.Login} element={<Signin />} />
          <Route path={AppUrls.Client.Tasks} element={<Tasks />} />
          {/* <Route
            path="*"
            element={<Navigate replace to={AppUrls.Client.NotFoundPage} />}
          /> */}
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default AppRoutes;
