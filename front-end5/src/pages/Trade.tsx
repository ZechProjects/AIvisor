import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tradeService } from "@/api/trade"

const Trade = () => {
  const [crypto, setCrypto] = useState("")
  const [type, setType] = useState<"BUY" | "SELL">("BUY")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = localStorage.getItem("userId")
    if (!userId) return

    try {
      const response = await tradeService.createTrade({
        userId,
        crypto,
        type,
        amount: Number.parseFloat(amount),
        price: Number.parseFloat(price),
      })
      
      console.log("Trade executed:", response.data)
      // Reset form
      setCrypto("")
      setAmount("")
      setPrice("")
      // TODO: Add success toast/notification
    } catch (error) {
      console.error("Error during trade:", error)
      // TODO: Add error toast/notification
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Trade</h1>
      <Card>
        <CardHeader>
          <CardTitle>Execute Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrade} className="space-y-4">
            <Select onValueChange={(value) => setCrypto(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                {/* Add more cryptocurrencies as needed */}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setType(value as "BUY" | "SELL")}>
              <SelectTrigger>
                <SelectValue placeholder="Select Trade Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUY">Buy</SelectItem>
                <SelectItem value="SELL">Sell</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
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

