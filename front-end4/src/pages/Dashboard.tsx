import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Portfolio, userService } from "@/api/user"

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState<Portfolio>({
    portfolio: {},
    usdtBalance: 0
  })

  useEffect(() => {
    const fetchPortfolio = async () => {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      try {
        const response = await userService.getPortfolio(userId)
        setPortfolioData(response.data)
      } catch (error) {
        console.error("Error fetching portfolio:", error)
      }
    }

    fetchPortfolio()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl mb-4">USDT Balance: ${portfolioData.usdtBalance.toFixed(2)}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(portfolioData.portfolio).map(([crypto, data]) => (
              <Card key={crypto}>
                <CardContent className="pt-6">
                  <p className="text-lg font-semibold">{crypto}</p>
                  <p className="text-2xl">Quantity: {data.quantity}</p>
                  <p className="text-xl">Avg Price: ${data.averagePrice}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

