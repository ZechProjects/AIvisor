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
import { aiService } from "@/api/ai"

const SUPPORTED_CRYPTOS = cryptoIds

interface TradeFormProps {
  selectedCrypto?: string;
  currentPrice?: number;
  holdings: number;
}

interface AgentResponse {
  type: "BUY" | "SELL";
  amount: number;
  reasoning: string;
}

export const TradeForm = ({ selectedCrypto, currentPrice, holdings }: TradeFormProps) => {
  const { toast } = useToast()
  const [crypto, setCrypto] = useState(selectedCrypto || "")
  const [type, setType] = useState<"BUY" | "SELL">("BUY")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState(currentPrice?.toString() || "")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationTimer, setConfirmationTimer] = useState(100)
  const [latestPrice, setLatestPrice] = useState(currentPrice || 0)
  const [showAiSuggestion, setShowAiSuggestion] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<AgentResponse | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userDecision, setUserDecision] = useState<{
    agree: boolean;
    accept: boolean;
  } | null>(null)

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

  const handleAiSuggest = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: AgentResponse | any = await aiService.getSuggestion({
        prompt: `I have ${holdings} amount of ${crypto}. How much Should I Buy or Sell and why?`,
        agentName: 'buy-sell-agent',
      })
      
      setAiSuggestion(response)
      setShowAiSuggestion(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "AI Suggestion Failed",
        description: "Unable to get AI trading suggestion",
        variant: "destructive",
      })
    }
  }

  const handleAiDecision = (agree: boolean, accept: boolean) => {
    setUserDecision({ agree, accept })
    setShowAiSuggestion(false)

    if (accept && aiSuggestion) {
      setType(aiSuggestion.type)
      setAmount(aiSuggestion.amount.toString())
      setShowConfirmation(true)
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

            <Button
              type="button"
              onClick={handleAiSuggest}
              disabled={!selectedCrypto || !currentPrice}
              className="w-full mb-2"
            >
              Get AI Suggestion
            </Button>

            <Button type="submit" className="w-full">
              Execute Trade
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showAiSuggestion} onOpenChange={setShowAiSuggestion}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>AI Trading Suggestion</DialogTitle>
            <DialogDescription>
              {aiSuggestion && (
                <div className="mt-4 space-y-2">
                  <p>Recommended Action: {aiSuggestion.type}</p>
                  <p>Amount: {aiSuggestion.amount} {crypto}</p>
                  <p className="font-semibold">Reasoning:</p>
                  <p>{aiSuggestion.reasoning}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col space-y-2">
            <div className="flex space-x-2">
              <Button onClick={() => handleAiDecision(true, true)}>
                Agree & Accept
              </Button>
              <Button onClick={() => handleAiDecision(false, true)}>
                Don't Agree but Accept
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleAiDecision(true, false)}>
                Agree but Don't Accept
              </Button>
              <Button variant="outline" onClick={() => handleAiDecision(false, false)}>
                Don't Agree & Don't Accept
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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