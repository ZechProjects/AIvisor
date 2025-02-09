import { useState, useEffect } from "react"
import { LearningModule } from "@/components/LearningModule"
import { coingeckoService } from "@/services/coingecko"
import { useApp } from "@/contexts/AppContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tradeService } from "@/api/trade"
import { Trade } from "@/api/types"
import { Portfolio } from "@/api/types"
import { getCryptoId } from "@/constants/cryptoIds"

interface CryptoDetails {
  crypto: string;
  amount: number;
  currentPrice: number;
  value: number;
}

const Dashboard = () => {
  const { portfolio, totalValue, usdtBalance } = useApp()
  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetails[]>([])
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    console.log(24, portfolio);
    const fetchCryptoPrices = async () => {
      try {
        console.log(29, portfolio);
        if (portfolio.length === 0) return;
        
        const cryptoIds = portfolio.map(p => getCryptoId(p.crypto));
        const prices = await coingeckoService.getPriceHistory(cryptoIds);
        
        const details = portfolio.map((item: Portfolio) => {
          console.log(35, prices);
          console.log(36, item.crypto)
          const currentPrice = prices.filter(p => p.symbol === item.crypto.toLowerCase())[0]?.current_price || 0;
          return {
            crypto: item.crypto,
            amount: item.amount,
            currentPrice,
            value: currentPrice * item.amount
          };
        });

        console.log(41, details);
        
        setCryptoDetails(details);
      } catch (error) {
        console.error('Failed to fetch crypto prices:', error);
      }
    };

    fetchCryptoPrices();
  }, [portfolio]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (userId) {
          const userTrades = await tradeService.getUserTrades(userId)
          setTrades(userTrades.data)
        }

      } catch (error) {
        console.error('Failed to fetch trades:', error)
      }
    }
    fetchTrades()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to EiLearn</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>USDT Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${usdtBalance.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${(totalValue).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="portfolio">
        <TabsList>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="trades">Trade History</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio">
          <div className="space-y-4">
            {cryptoDetails.length === 0 ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center text-gray-500">No cryptocurrencies in portfolio</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-2">Cryptocurrency</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Price</th>
                        <th className="pb-2">Value (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoDetails.map((crypto) => (
                        <tr key={crypto.crypto}>
                          <td className="py-2">{crypto.crypto.toUpperCase()}</td>
                          <td className="py-2">{crypto.amount.toFixed(8)}</td>
                          <td className="py-2">${crypto.currentPrice.toFixed(2)}</td>
                          <td className="py-2">${crypto.value.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trades">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2">Crypto</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Total</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade) => (
                      <tr key={trade.tradeId}>
                        <td className="py-2">{trade.crypto.toUpperCase()}</td>
                        <td className={`py-2 ${trade.type === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.type}
                        </td>
                        <td className="py-2">{trade.amount}</td>
                        <td className="py-2">${trade.price.toFixed(2)}</td>
                        <td className="py-2">${(trade.amount * trade.price).toFixed(2)}</td>
                        <td className="py-2">{new Date(trade.timestamp).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
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

