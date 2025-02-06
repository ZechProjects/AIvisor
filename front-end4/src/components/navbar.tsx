import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

const Navbar = () => {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            CryptoTrade AI
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
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

