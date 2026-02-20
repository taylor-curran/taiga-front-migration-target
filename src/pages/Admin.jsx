import { useParams, useLocation, Navigate, Routes, Route } from 'react-router-dom';
import AdminNav from '../components/admin/AdminNav';
import ProjectSettings from '../components/admin/ProjectSettings';
import Memberships from '../components/admin/Memberships';
import Permissions from '../components/admin/Permissions';
import CustomFields from '../components/admin/CustomFields';
import Modules from '../components/admin/Modules';
import Integrations from '../components/admin/Integrations';
import '../styles/pages/Admin.css';

const getActiveSection = (pathname) => {
  if (pathname.includes('/admin/project-profile')) return 'project-profile';
  if (pathname.includes('/admin/project-values')) return 'project-values';
  if (pathname.includes('/admin/memberships')) return 'memberships';
  if (pathname.includes('/admin/roles')) return 'roles';
  if (pathname.includes('/admin/integrations')) return 'integrations';
  if (pathname.includes('/admin/modules')) return 'modules';
  return 'project-profile';
};

const Admin = () => {
  const { slug } = useParams();
  const location = useLocation();
  const activeSection = getActiveSection(location.pathname);

  return (
    <div className="admin-page">
      <div className="admin-layout">
        <AdminNav activeSection={activeSection} />
        <div className="admin-content">
          <Routes>
            <Route
              index
              element={<Navigate to="project-profile/details" replace />}
            />
            <Route
              path="project-profile/details"
              element={<ProjectSettings slug={slug} />}
            />
            <Route
              path="memberships"
              element={<Memberships slug={slug} />}
            />
            <Route
              path="roles"
              element={<Permissions slug={slug} />}
            />
            <Route
              path="project-values/custom-fields"
              element={<CustomFields slug={slug} />}
            />
            <Route
              path="modules"
              element={<Modules slug={slug} />}
            />
            <Route
              path="integrations"
              element={<Integrations slug={slug} />}
            />
            <Route
              path="*"
              element={<Navigate to="project-profile/details" replace />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
