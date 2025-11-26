import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import OverviewPage from "./pages/OverviewPage";
import ConsciousnessPage from "./pages/ConsciousnessPage";
import OrgansPage from "./pages/OrgansPage";
import AgentsPage from "./pages/AgentsPage";
import EconomyPage from "./pages/EconomyPage";
import EventsPage from "./pages/EventsPage";
import ControlsPage from "./pages/ControlsPage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/admin/overview" element={<OverviewPage />} />
          <Route path="/admin/consciousness" element={<ConsciousnessPage />} />
          <Route path="/admin/organs" element={<OrgansPage />} />
          <Route path="/admin/agents" element={<AgentsPage />} />
          <Route path="/admin/economy" element={<EconomyPage />} />
          <Route path="/admin/events" element={<EventsPage />} />
          <Route path="/admin/controls" element={<ControlsPage />} />
          <Route path="/" element={<Navigate to="/admin/overview" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

