import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import { Menu } from "./Menu"
import { Game } from "./Game"

const router = createBrowserRouter([
  {
    path: "/",
    // element: <Menu />,
    element: <Game />
  },
  {
    path: "/game",
    element: <Game />
  }
]);

export const Pages = () => {
  return <RouterProvider router={router} />
}
