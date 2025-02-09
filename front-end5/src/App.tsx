import { Route, Routes } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import Navbar from "./components/navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AIAgents from "./pages/AIAgents"
import Trade from "./pages/Trade"
import Leaderboard from "./pages/Leaderboard"
import { Toaster } from "@/components/ui/toaster"

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
                  <Dashboard />
              } 
            />
            <Route 
              path="/ai-agents" 
              element={
                  <AIAgents />
              } 
            />
            <Route 
              path="/trade" 
              element={
                  <Trade />
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                  <Leaderboard />
              } 
            />
          </Routes>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App

