import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { authService } from "@/api/auth"
import { AxiosError } from 'axios'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resetRequestSent, setResetRequestSent] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      const response = await authService.login({ email: username, password })
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("userId", response.data.user.userId)
      navigate("/dashboard")
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>
      setError(axiosError.response?.data?.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!username) {
      setError("Please enter your email first")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await authService.requestPasswordReset(username)
      setResetRequestSent(true)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>
      setError(axiosError.response?.data?.message || "Failed to send password reset request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {resetRequestSent && (
                <div className="text-green-500 text-sm">
                  Password reset instructions have been sent to your email
                </div>
              )}
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="username"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              Forgot Password?
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login

