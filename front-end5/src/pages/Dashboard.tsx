import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Portfolio } from "@/api/types"
import { portfolioService } from "@/api/portfolio"

const Dashboard = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [usdtBalance, setUsdtBalance] = useState(0)
  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    const fetchPortfolio = async () => {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      try {
        const response = await portfolioService.getPortfolios(userId)
        setPortfolios(response.data.portfolio)
        setUsdtBalance(response.data.usdtBalance)
        setTotalValue(response.data.totalValue)
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
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">USDT Balance</p>
              <p className="text-xl">${usdtBalance.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
              <p className="text-xl">${totalValue.toFixed(2)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.crypto}>
                <CardContent className="pt-6">
                  <p className="text-lg font-semibold">{portfolio.crypto}</p>
                  <p className="text-2xl">Quantity: {portfolio.amount}</p>
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

