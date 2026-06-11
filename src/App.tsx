import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Project from '@/pages/Project'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:slug" element={<Project />} />
      </Routes>
    </HashRouter>
  )
}
