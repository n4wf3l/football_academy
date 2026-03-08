import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import PlayersIndex from './pages/Players/Index'
import PlayerShow from './pages/Players/Show'
import Gallery from './pages/Gallery'
import Program from './pages/Program'
import Tournaments from './pages/Tournaments'
import Contact from './pages/Contact'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/players" element={<PlayersIndex />} />
          <Route path="/players/:id" element={<PlayerShow />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/program" element={<Program />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
