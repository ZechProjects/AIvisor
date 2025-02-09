import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
// import { ModeToggle } from "./mode-toggle"
import { authService } from "@/api/auth"

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authService.logout()
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      navigate('/login')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            EiLearn
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="/ai-agents">
              <Button variant="ghost">AI Agents</Button>
            </Link>
            <Link to="/trade">
              <Button variant="ghost">Trade</Button>
            </Link>
            {localStorage.getItem('token') ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
            {/* <ModeToggle /> */}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

