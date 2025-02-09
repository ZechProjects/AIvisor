"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { aiService } from "@/api/ai"

interface Agent {
  _id: string
  name: string
  description: string
}

const AIAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [suggestion, setSuggestion] = useState("")

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await aiService.getAgents()
        setAgents(response.data)
      } catch (error) {
        console.error("Error fetching AI agents:", error)
      }
    }

    fetchAgents()
  }, [])

  const handleGetSuggestion = async () => {
    if (!selectedAgent) return

    try {
      const response = await aiService.getSuggestion({ prompt, agentName: selectedAgent })
      setSuggestion(response.data.suggestion)
    } catch (error) {
      console.error("Error getting AI suggestion:", error)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">AI Agents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card key={agent._id} className={selectedAgent === agent._id ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{agent.name}</CardTitle>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setSelectedAgent(agent._id)}>Select</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedAgent && (
        <Card>
          <CardHeader>
            <CardTitle>Get AI Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Enter your prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <Button onClick={handleGetSuggestion}>Get Suggestion</Button>
            {suggestion && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">AI Suggestion:</h3>
                <p>{suggestion}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AIAgents

