import { useState, useEffect } from "react"
import { PriceTickerCard } from "@/components/PriceTickerCard"
import { cryptoIds } from "@/constants/cryptoIds"
import { TradeForm } from "@/components/TradeForm"
import { portfolioService } from "@/api/portfolio"

const SUPPORTED_CRYPTOS = cryptoIds.slice(0, 5)

const Trade = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>()
  const [currentPrice, setCurrentPrice] = useState<number>()
  const [holdings, setHoldings] = useState<number>(0)

  useEffect(() => {
    const fetchHoldings = async () => {
      if (selectedCrypto) {
        const userId = localStorage.getItem("userId") ?? ""
        try {
          const response = await portfolioService.getPortfolios(userId)
          const cryptoPortfolio = response.data.portfolio.find(
            p => p.crypto === selectedCrypto
          )
          setHoldings(cryptoPortfolio?.amount || 0)
        } catch (error) {
          console.error("Failed to fetch holdings:", error)
        }
      }
    }
    fetchHoldings()
  }, [selectedCrypto])

  const handleCryptoSelect = (symbol: string) => {
    setSelectedCrypto(symbol)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trade</h1>

      <TradeForm 
        selectedCrypto={selectedCrypto}
        currentPrice={currentPrice}
        holdings={holdings}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUPPORTED_CRYPTOS.map((crypto, index) => {
          return (
            <div 
              key={crypto.id}
              onClick={() => handleCryptoSelect(crypto.symbol)}
              className="cursor-pointer"
            >
              <PriceTickerCard
                cryptoId={crypto.id}
                symbol={crypto.symbol}
                updateInterval={(index + 1) * 10000}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onPriceUpdate={(price: any) => {
                  if (selectedCrypto === crypto.symbol) {
                    setCurrentPrice(price)
                  }
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Trade

