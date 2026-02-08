import { BrowserRouter, Routes, Route } from "react-router-dom";
import WorkerLogin from "./pages/WorkerLogin";
import WorkerSignup from "./pages/WorkerSignup";
import WorkerPage from "./pages/WorkerPage";
import SupervisorPage from "./pages/SupervisorPage";
import SupervisorLogin from "./pages/SupervisorLogin";
import AppInitializer from "./AppInitializer";



function App() {
  return (
    <BrowserRouter>
      <AppInitializer />
      <Routes>
        <Route path="/" element={<WorkerLogin />} />
        <Route path="/signup" element={<WorkerSignup />} />
        <Route path="/worker" element={<WorkerPage />} />
        <Route path="/supervisor" element={<SupervisorPage />} />
        <Route path="/supervisor-login" element={<SupervisorLogin />} />
        <Route path="/supervisor" element={<SupervisorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
