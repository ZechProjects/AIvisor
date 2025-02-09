import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import { ModeToggle } from "./mode-toggle"

import { usePrivy } from "@privy-io/react-auth";

const Navbar = () => {
  const { ready, authenticated, login } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

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
            <Button disabled={disableLogin} onClick={login}>
              Login
            </Button>
            {/* <ModeToggle /> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
