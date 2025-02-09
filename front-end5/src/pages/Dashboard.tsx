import { useState, useEffect } from "react"
import { CryptoChart } from "@/components/CryptoChart"
import { LearningModule } from "@/components/LearningModule"
import { coingeckoService } from "@/services/coingecko"
import { useApp } from "@/contexts/AppContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CryptoPrice {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}


const Dashboard = () => {
  const { portfolio, totalValue } = useApp()
  const [priceData, setPriceData] = useState<CryptoPrice[]>([])

  useEffect(() => {
    const fetchPrices = async () => {
      const cryptoIds = portfolio.map(p => p.crypto.toLowerCase())
      const data = await coingeckoService.getPriceHistory(cryptoIds)
      setPriceData(data)
    }
    fetchPrices()
  }, [portfolio])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to EiLearn</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>
        {/* Add more summary cards */}
      </div>

      <Tabs defaultValue="portfolio">
        <TabsList>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio">
          <div className="space-y-4">
            {priceData.map(crypto => (
              <CryptoChart
                key={crypto.id}
                data={crypto.sparkline_in_7d.price.map((price: number, index: number) => ({
                  timestamp: Date.now() - (7 * 24 * 60 * 60 * 1000) + (index * 3600000),
                  price,
                }))}
                title={`${crypto.symbol.toUpperCase()} Price History`}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learning">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LearningModule
              title="Crypto Trading Basics"
              description="Learn the fundamentals of cryptocurrency trading"
              progress={30}
              onStart={() => {/* Handle start */}}
            />
            <LearningModule
              title="EigenLayer Fundamentals"
              description="Understanding EigenLayer and its role in decentralization"
              progress={0}
              onStart={() => {/* Handle start */}}
            />
            {/* Add more learning modules */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard

