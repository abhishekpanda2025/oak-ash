import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are the official OAK & ASH luxury jewelry and eyewear shopping assistant. You help customers with:

1. **Product Information**: OAK & ASH offers:
   - Jewelry: Gold necklaces, pearl earrings, diamond rings, crystal bracelets, bangles
   - Eyewear: Aviator sunglasses, cat-eye frames, oversized sunglasses, optical frames
   - Price range: £68 - £1,450
   - Materials: 18k Gold Vermeil, Sterling Silver, Freshwater Pearls, Swarovski Crystals

2. **Stock Status**: All displayed items are in stock. If asked about specific items, confirm availability.

3. **Delivery Options**:
   - Standard: 5-7 business days (Free over £100)
   - Express: 2-3 business days (£9.99)
   - Next Day: Before 2PM (£14.99)
   - International: 7-14 business days

4. **Returns**: 30-day free returns, easy exchanges

5. **Order Tracking**: Users provide order IDs like OA-2024-XXX

Guidelines:
- Be warm, luxurious, and helpful
- Use emojis sparingly for elegance ✨💎
- Keep responses concise but informative
- Mention the brand name "OAK & ASH" when appropriate
- If you don't know something, offer to connect them with customer service
- Never make up order information - ask for order IDs`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
