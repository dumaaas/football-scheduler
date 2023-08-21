import { useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/Home";
import Game from "./pages/Game";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import useStore from "./store/store";

function App() {
  const { user } = useStore();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/game/:gameId",
      element: <Game />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
  ]);

  const [queryClient] = useState(() => new QueryClient());

  if (!user && window.location.pathname !== "/login")
    window.location.replace("/login");

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Layout>
          <RouterProvider router={router} />
        </Layout>
      </QueryClientProvider>
    </div>
  );
}

export default App;
