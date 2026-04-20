import "./App.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {allRoutes} from "./routes";

// const socket = io("http://localhost:9999");

const router = createBrowserRouter(allRoutes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
