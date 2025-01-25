import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { Master } from "./layouts/master/Master.tsx";
import { RootLayout } from "./layouts/master/RootLayout.tsx";
import Loading from "./components/loading.tsx";
import ProtectedRoute from "./components/protectRoute.tsx";

const LazyHomePage = lazy(() => import("./pages/homepage.tsx"));
const Movies = lazy(() => import("./pages/movies.tsx"));
const MovieDetail = lazy(() => import("./pages/movieDetail.tsx"));
const AddMovie = lazy(() => import("./pages/addmovie.tsx"));
const EditMovie = lazy(() => import("./pages/EditMovie.tsx"));
const MovieTable = lazy(() => import("./pages/table.tsx"));
const Login = lazy(() => import("./pages/login.tsx"));

// Protected Route Component

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: (
          <ProtectedRoute>
            <Master />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/",
            children: [
              {
                path: "",
                element: <LazyHomePage />,
              },
              {
                path: "/movies",
                element: <Movies />,
              },
              {
                path: "/moviesDetail/:id",
                element: <MovieDetail />,
              },
              {
                path: "/EditMovie/:id",
                element: <EditMovie />,
              },
              {
                path: "/movieTable",
                element: <MovieTable />,
              },
              {
                path: "/add-movie",
                element: <AddMovie />,
              },
              {
                path: "/login",
                element: <Login />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loading size="lg"  fullScreen />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
