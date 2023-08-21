import { useState } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/Home";
import Game from "./pages/Game";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import useStore from "./store/store";
import MyProfile from "./pages/MyProfile";

function App() {
  const { user } = useStore();

  const [queryClient] = useState(() => new QueryClient());

  if (!user && window.location.pathname !== "/login")
    window.location.replace("/login");

  return (
    <div className="App">
      <Router>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Routes>
              {user ? (
                <>
                  <Route path="/" Component={Home} />
                  <Route path="/game/:gameId" Component={Game} />
                  <Route path="/dashboard" Component={Dashboard} />
                  <Route path="/login" Component={Login} />
                  <Route path="/profile" Component={MyProfile} />
                </>
              ) : (
                <Route path="/login" Component={Login} />
              )}
            </Routes>
          </Layout>
        </QueryClientProvider>
      </Router>
    </div>
  );
}

export default App;
