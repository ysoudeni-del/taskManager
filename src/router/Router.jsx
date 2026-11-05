import { createHashRouter } from "react-router-dom";
import App from "../App";
import Home from "../components/Home";
import ErrorPage from "../pages/ErrorPage";

const router = createHashRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

export default router;
