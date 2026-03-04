import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import WorkerLogin from "./pages/WorkerLogin";
import WorkerSignup from "./pages/WorkerSignup";
import WorkerPage from "./pages/WorkerPage";
import HomePage from "./pages/HomePage";
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

        <Route path="/" element={<HomePage />} />

        <Route path="/worker-login" element={<WorkerLogin />} />
        <Route path="/worker" element={<WorkerPage />} />
        <Route path="/signup" element={<WorkerSignup />} />

        <Route path="/supervisor-login" element={<SupervisorLogin />} />

        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="workers" element={<SupervisorWorkers />} />
          <Route path="alerts" element={<SupervisorAlerts />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
