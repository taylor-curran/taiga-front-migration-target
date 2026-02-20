import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Backlog from './pages/Backlog';
import KanbanBoard from './pages/KanbanBoard';
import Notifications from './components/Notifications';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="discover" element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="project/:slug" element={<ProjectDetail />} />
            <Route path="project/:slug/backlog" element={<Backlog />} />
            <Route path="project/:slug/kanban" element={<KanbanBoard />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;
