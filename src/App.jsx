import { BrowserRouter, Routes, Route } from "react-router-dom";

import WorkerLogin from "./pages/WorkerLogin";
import WorkerSignup from "./pages/WorkerSignup";
import WorkerPage from "./pages/WorkerPage";

import SupervisorPage from "./pages/SupervisorPage";
import SupervisorLogin from "./pages/SupervisorLogin";

import AppInitializer from "./AppInitializer";

import SupervisorWorkers from "./components/supervisor/SupervisorWorkers";
import SupervisorDashboard from "./components/supervisor/SupervisorDashboard";
import SupervisorAlerts from "./components/supervisor/SupervisorAlerts"; // ⭐ MISSING IMPORT
import SupervisorLayout from "./pages/supervisor/SupervisorLayout";

function App() {
  return (
    <BrowserRouter>
      <AppInitializer />

      <Routes>

        {/* Worker Routes */}
        <Route path="/" element={<WorkerLogin />} />
        <Route path="/signup" element={<WorkerSignup />} />
        <Route path="/worker" element={<WorkerPage />} />

        {/* Supervisor Routes */}
        <Route path="/supervisor" element={<SupervisorPage />} />
        <Route path="/supervisor-login" element={<SupervisorLogin />} />
        <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />

        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="workers" element={<SupervisorWorkers />} />
          <Route path="alerts" element={<SupervisorAlerts />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
