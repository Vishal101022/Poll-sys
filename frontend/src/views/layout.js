import Header from "../components/header";
import { Route, Routes } from "react-router-dom";
import Home from "./home";

const GeneralLayout = ({ isAuth, auth }) => {
  return (
    <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased text-black dark:text-white">
      <Header isAuth={isAuth} auth={auth} />
      {/* Main content */}
      <main className="flex-1 flex-grow mx-auto  w-full">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
};

export default GeneralLayout;
