import { Route, Routes } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Navbar from "./components/navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AIAgents from "./pages/AIAgents"
import Trade from "./pages/Trade"
import Leaderboard from "./pages/Leaderboard"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-agents" 
              element={
                <ProtectedRoute>
                  <AIAgents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trade" 
              element={
                <ProtectedRoute>
                  <Trade />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App

