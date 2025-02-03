import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./views/creator/auth/login";
import Register from "./views/creator/auth/register";
import CreatorLayout from "./views/creator/layout.js";
import { Suspense, useEffect, useState } from "react";

import ViewPoll from "./views/poll/view_poll";
import PollResult from "./views/poll/poll_result.js";
import Loader from "./components/_loader";
// import ContactUs from "./views/contact_us.js";
import Layout from "./views/layout";
import socket from "./services/socket.service";
import AdminLogin from "./views/admin/auth/login";
import AdminLayout from "./views/admin/layout";
import {
  isAuthenticated,
} from "./helpers/localstorage";


function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated()) {
      setIsAuth(true);
      setAuth({
        user: isAuthenticated(),
      });
    }
    setLoading(false);
  }, [location]);

  useEffect(() => {
    if (isAuth) {
      setIsAuth(true);
      setAuth({
        user: isAuthenticated(),
      });
    }
    setLoading(false);
  }, [isAuth]);

  useEffect(() => {
    if (socket.readyState === WebSocket.OPEN) {
      console.log("WebSocket connection is already open.");
    } else {
      socket.connect();
      console.log("WebSocket connection ");
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  
  return (
    <>
      <ToastContainer />
      <Suspense fallback={<Loader />}>
        {!loading && (
          <Routes>
            {/* Non-authenticated Routes */}
            {!isAuth && (
              <>
                <Route
                  path="/login"
                  element={<Login setIsAuth={setIsAuth} />}
                />
                <Route path="/register" element={<Register />} />
               
                
              
                <Route
                  exact
                  path="/admin/loginxyz"
                  element={
                    <AdminLogin setIsAuth={setIsAuth} setAuth={setAuth} />
                  }
                />
                <Route exact path="/poll/:pollId" element={<ViewPoll />} />
                <Route exact path="/results/:pollId" element={<PollResult />} />
                <Route exact path="*" element={<Layout />} />
              </>
            )}

            {/* Authenticated Routes */}
            {isAuth && auth && auth.user && (
              <>
                {auth.user.role === "creator" && (
                  <Route path="/creator/*" element={<CreatorLayout />} />
                )}
                {auth.user.role === "admin" && (
                  <Route exact path="/admin/*" element={<AdminLayout />} />
                )}
                <Route exact path="/poll/:pollId" element={<ViewPoll />} />
                <Route exact path="/results/:pollId" element={<PollResult />} />
                <Route exact path="*" element={<Layout />} />
              </>
            )}

          
          </Routes>
        )}
      </Suspense>

      
    </>
  );
}

export default App;
