import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { userService } from "@/api/user"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface LeaderboardEntry {
  userId: string
  email: string
  totalValue: number
  usdtBalance: number
}

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await userService.getTopUsers(10)
        setLeaders(response.data)
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
      } finally {
        setIsLoading(false)
      }

    }

    fetchLeaders()
    // Refresh every 5 minutes
    const interval = setInterval(fetchLeaders, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Top Traders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaders.map((leader, index) => (
              <div
                key={leader.userId}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold">
                    #{index + 1}
                  </div>
                  <Avatar>
                    <AvatarFallback>
                      {leader.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{leader.email}</div>
                    <div className="text-sm text-muted-foreground">
                      Balance: ${leader.usdtBalance.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold">
                  ${leader.totalValue.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Leaderboard 