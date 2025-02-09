import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tradeService } from "@/api/trade"
import { PriceTickerCard } from "@/components/PriceTickerCard"
import { useToast } from "@/hooks/use-toast"

const SUPPORTED_CRYPTOS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  // Add more supported cryptocurrencies
]

const Trade = () => {
  const { toast } = useToast()
  const [crypto, setCrypto] = useState("")
  const [type, setType] = useState<"BUY" | "SELL">("BUY")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = localStorage.getItem("userId")
    if (!userId) return

    try {
      await tradeService.createTrade({
        userId,
        crypto,
        type,
        amount: Number.parseFloat(amount),
        price: Number.parseFloat(price),
      })
      
      toast({
        title: "Trade Executed",
        description: `Successfully ${type.toLowerCase()}ed ${amount} ${crypto}`,
      })

      // Reset form
      setCrypto("")
      setAmount("")
      setPrice("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Trade Failed",
        description: "Failed to execute trade. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trade</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUPPORTED_CRYPTOS.map((crypto) => (
          <PriceTickerCard
            key={crypto.id}
            cryptoId={crypto.id}
            symbol={crypto.symbol}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Execute Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrade} className="space-y-4">
            <Select onValueChange={(value) => setCrypto(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Cryptocurrency" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto z-50 bg-white">
                {SUPPORTED_CRYPTOS.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.symbol}>
                    {crypto.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => setType(value as "BUY" | "SELL")}>
              <SelectTrigger>
                <SelectValue placeholder="Select Trade Type" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto z-50 bg-white">
                <SelectItem value="BUY">Buy</SelectItem>
                <SelectItem value="SELL">Sell</SelectItem>
              </SelectContent>
            </Select>

            <Input 
              type="number" 
              placeholder="Amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
            
            <Input 
              type="number" 
              placeholder="Price" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
            />

            <Button type="submit" className="w-full">
              Execute Trade
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Trade

