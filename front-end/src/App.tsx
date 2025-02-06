// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Trade from "./pages/Trade";
import AIAdvisor from "./pages/AIAdvisor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/advisor" element={<AIAdvisor />} />
      </Routes>
    </Router>
  );
}

export default App;
