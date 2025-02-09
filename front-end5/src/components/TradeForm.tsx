import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tradeService } from "@/api/trade"
import { useToast } from "@/hooks/use-toast"
import { cryptoIds } from "@/constants/cryptoIds"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { coingeckoService } from "@/services/coingecko"
import { getCryptoId } from "@/constants/cryptoIds"

const SUPPORTED_CRYPTOS = cryptoIds

interface TradeFormProps {
  selectedCrypto?: string;
  currentPrice?: number;
}

export const TradeForm = ({ selectedCrypto, currentPrice }: TradeFormProps) => {
  const { toast } = useToast()
  const [crypto, setCrypto] = useState(selectedCrypto || "")
  const [type, setType] = useState<"BUY" | "SELL">("BUY")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState(currentPrice?.toString() || "")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationTimer, setConfirmationTimer] = useState(100)
  const [latestPrice, setLatestPrice] = useState(currentPrice || 0)

  // Update form when selectedCrypto or currentPrice changes
  useEffect(() => {
    if (selectedCrypto) setCrypto(selectedCrypto)
    if (currentPrice) setPrice(currentPrice.toString())
  }, [selectedCrypto, currentPrice])

  // Confirmation dialog timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    let interval: NodeJS.Timeout

    if (showConfirmation) {
      setConfirmationTimer(100)
      
      interval = setInterval(() => {
        setConfirmationTimer((prev) => Math.max(0, prev - 2))
      }, 100)

      timer = setTimeout(() => {
        setShowConfirmation(false)
        handleConfirmTrade()
      }, 5000)
    }

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [showConfirmation])

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Fetch latest price from CoinGecko
    try {
      const cryptoId = getCryptoId(crypto)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const priceData: any = await coingeckoService.getPrice(cryptoId)
      const newPrice = priceData[cryptoId]?.usd
      
      if (!newPrice) {
        throw new Error('Price not available')
      }
      
      setLatestPrice(newPrice)
      setShowConfirmation(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Check specifically for rate limit error
      if (error.response?.status === 429) {
        console.log(81, "error")
        toast({
          title: "Rate Limit Exceeded",
          description: "Too many requests. Please wait a moment and try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch latest price",
          variant: "destructive",
        })
      }
    }
  }

  const handleConfirmTrade = async () => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to execute trades",
        variant: "destructive",
      })
      setShowConfirmation(false)
      return
    }

    try {
      await tradeService.createTrade({
        userId,
        crypto,
        type,
        amount: Number.parseFloat(amount),
        price: latestPrice,
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
    <>
      <Card className="sticky top-4 bg-white">
        <CardHeader>
          <CardTitle>Execute Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrade} className="space-y-4">
            <Select value={crypto} onValueChange={(value) => setCrypto(value)}>
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
            
            <Select value={type} onValueChange={(value) => setType(value as "BUY" | "SELL")}>
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
              disabled
            />

            <Button type="submit" className="w-full">
              Execute Trade
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Trade</DialogTitle>
            <DialogDescription>
              Please confirm your trade details:
              <div className="mt-4 space-y-2">
                <p>Type: {type}</p>
                <p>Crypto: {crypto}</p>
                <p>Amount: {amount}</p>
                <p>Latest Price: ${latestPrice}</p>
                <p>Total Value: ${(Number(amount) * latestPrice).toFixed(2)}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <Progress value={confirmationTimer} className="w-full" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmTrade}>
              Confirm Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 