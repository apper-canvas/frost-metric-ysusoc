import Dashboard from '@/components/pages/Dashboard';
import Contacts from '@/components/pages/Contacts';
import ContactDetail from '@/components/pages/ContactDetail';
import Pipeline from '@/components/pages/Pipeline';
import Tasks from '@/components/pages/Tasks';
import Settings from '@/components/pages/Settings';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: Contacts
  },
  contactDetail: {
    id: 'contactDetail',
    label: 'Contact Detail',
    path: '/contacts/:id',
    icon: 'User',
    component: ContactDetail,
    hidden: true
  },
  pipeline: {
    id: 'pipeline',
    label: 'Pipeline',
    path: '/pipeline',
    icon: 'TrendingUp',
    component: Pipeline
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;