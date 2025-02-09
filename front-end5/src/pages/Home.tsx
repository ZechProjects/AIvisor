import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { usePrivy } from "@privy-io/react-auth";

const Home = () => {
  const navigate = useNavigate();
  const { ready, authenticated, login } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle className="text-4xl text-center">
            Welcome to AI Trading Platform
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Your intelligent companion for automated trading
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center">
            Get started with our AI-powered trading platform. Create an account
            to access advanced trading features and AI agents.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/register")} size="lg">
              Get Started
            </Button>
            <Button
              disabled={disableLogin}
              onClick={login}
              variant="outline"
              size="lg"
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
