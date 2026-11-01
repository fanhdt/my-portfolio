import { createBrowserRouter } from "react-router";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Skills from "../pages/Skills";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import Contact from "../pages/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "skills",
        element: <Skills />,
      },
      { path: "projects", element: <Projects /> },
      { path: "projects/:slug", element: <ProjectDetail /> },

      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
]);

export default router;
