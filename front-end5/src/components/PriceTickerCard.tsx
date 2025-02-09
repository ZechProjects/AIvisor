import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { coingeckoService } from "@/services/coingecko"

interface PriceTickerCardProps {
  cryptoId: string
  symbol: string
  onPriceUpdate?: (price: number | null) => void
  updateInterval?: number
}

export const PriceTickerCard = ({ 
  cryptoId, 
  symbol, 
  onPriceUpdate,
  updateInterval = 30000
}: PriceTickerCardProps) => {
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

    // Initial fetch
    fetchPrice()
    
    // Calculate initial delay based on updateInterval
    const initialDelay = setTimeout(() => {
      fetchPrice()
      // Set up recurring interval after initial delay
      const interval = setInterval(fetchPrice, updateInterval)
      return () => clearInterval(interval)
    }, updateInterval)

    return () => clearTimeout(initialDelay)
  }, [cryptoId, symbol, updateInterval])

  useEffect(() => {
    // When price updates
    if (onPriceUpdate) {
      onPriceUpdate(price)
    }
  }, [price, onPriceUpdate])

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