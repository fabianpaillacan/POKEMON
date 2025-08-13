import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
//import App from './App.jsx'
import LandingPage from './pages/LandingPage.jsx'
import PokeGrid from './pages/PokeGridPage.jsx'
import PokeDex from './pages/PokedexPage.jsx'

const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/pokegrid",
    element: <PokeGrid/>,
  },
  {
    path: "/pokedex/:id",
    element: <PokeDex/>,
  },

];

const router = createBrowserRouter(routes);

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
