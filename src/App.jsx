import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Backlog from './pages/Backlog';
import KanbanBoard from './pages/KanbanBoard';
import Wiki from './pages/Wiki';
import Issues from './pages/Issues';
import Epics from './pages/Epics';
import UserProfile from './pages/UserProfile';
import UserSettings from './pages/UserSettings';
import Admin from './pages/Admin';
import Search from './components/Search';
import Notifications from './components/Notifications';
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
          <Route path="project/:slug/wiki" element={<Wiki />} />
          <Route path="project/:slug/wiki/:wikiSlug" element={<Wiki />} />
          <Route path="project/:slug/wiki-list" element={<Wiki />} />
          <Route path="project/:slug/issues" element={<Issues />} />
          <Route path="project/:slug/epics" element={<Epics />} />
          <Route path="project/:slug/admin" element={<Admin />} />
          <Route path="project/:slug/search" element={<Search />} />
          <Route path="profile/:username" element={<UserProfile />} />
          <Route path="user-settings" element={<UserSettings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
