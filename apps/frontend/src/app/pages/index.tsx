import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import { Home } from "./Home"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

export const Pages = () => {
  return <RouterProvider router={router} />
}
