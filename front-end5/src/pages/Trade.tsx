import { useState } from "react"
import { PriceTickerCard } from "@/components/PriceTickerCard"
import { cryptoIds } from "@/constants/cryptoIds"
import { TradeForm } from "@/components/TradeForm"

const SUPPORTED_CRYPTOS = cryptoIds.slice(0, 5)

const Trade = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>()
  const [currentPrice, setCurrentPrice] = useState<number>()

  const handleCryptoSelect = (symbol: string) => {
    setSelectedCrypto(symbol)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trade</h1>

      <TradeForm 
        selectedCrypto={selectedCrypto}
        currentPrice={currentPrice}
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

