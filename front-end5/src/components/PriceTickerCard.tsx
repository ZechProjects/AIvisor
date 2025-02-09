import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { coingeckoService } from "@/services/coingecko"

interface PriceTickerProps {
  cryptoId: string
  symbol: string
}

export function PriceTickerCard({ cryptoId, symbol }: PriceTickerProps) {
  const [price, setPrice] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<number>(0)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const data = await coingeckoService.getPriceHistory([cryptoId])
        if (data[0]) {
          const newPrice = data[0].current_price
          setPriceChange(data[0].price_change_percentage_24h)
          setPrice((prevPrice) => {
            if (prevPrice !== null) {
              // Add animation class based on price change
              const element = document.getElementById(`price-${cryptoId}`)
              if (element) {
                element.classList.add(newPrice > prevPrice ? 'price-up' : 'price-down')
                setTimeout(() => {
                  element.classList.remove('price-up', 'price-down')
                }, 1000)
              }
            }
            return newPrice
          })
        }
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [cryptoId, symbol])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{symbol.toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div id={`price-${cryptoId}`} className="text-2xl font-bold">
          ${price?.toFixed(2) ?? "Loading..."}
        </div>
        <div className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {priceChange.toFixed(2)}% (24h)
        </div>
      </CardContent>
    </Card>
  )
} 