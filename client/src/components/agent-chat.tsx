import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setIsSending(true);
    try {
      const res = await apiRequest("POST", "/api/agent", {
        sessionId,
        message: userMessage.content,
      });
      const data = await res.json();
      setSessionId(data.sessionId);
      const reply: ChatMessage = { role: "assistant", content: data.message };
      setMessages((m) => [...m, reply]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Ask the Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto text-sm">
          {messages.map((m, idx) => (
            <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
              <span className={m.role === "user" ? "bg-primary text-white px-2 py-1 rounded" : "bg-gray-100 px-2 py-1 rounded"}>{m.content}</span>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" />
          <Button onClick={sendMessage} disabled={isSending}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
