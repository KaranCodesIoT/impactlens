import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import CoralReefSurveyDashboard from './pages/CoralReefSurveyDashboard';
import DashboardView from './pages/DashboardView';
import DatasetsView from './pages/DatasetsView';
import ReportsView from './pages/ReportsView';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111622',
            color: '#f8fafc',
            border: '1px solid #1e2634',
            borderRadius: '10px',
            fontSize: '0.8125rem',
            fontWeight: '500'
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#111622' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#111622' } }
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default / Projects route */}
          <Route index element={<CoralReefSurveyDashboard />} />
          <Route path="project/coral-reef-survey" element={<CoralReefSurveyDashboard />} />
          <Route path="project/:id" element={<CoralReefSurveyDashboard />} />
          <Route path="projects" element={<CoralReefSurveyDashboard />} />

          {/* New Sidebar Views */}
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="datasets" element={<DatasetsView />} />
          <Route path="reports" element={<ReportsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}



export default App;
