import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Backlog from './pages/Backlog';
import KanbanBoard from './pages/KanbanBoard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project/:slug" element={<ProjectDetail />} />
          <Route path="project/:slug/backlog" element={<Backlog />} />
          <Route path="project/:slug/kanban" element={<KanbanBoard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
