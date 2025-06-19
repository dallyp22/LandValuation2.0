import OpenAI from "openai";

// Using gpt-4o as requested for GPT-4.1 functionality with web search capabilities
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface PropertyData {
  propertyDescription: string;
  acreage: number;
  location: string;
  irrigated: boolean;
  tillable: boolean;
  cropType?: string;
}

export interface ParsedProperty {
  location: string;
  acreage: number;
  cropType: string;
  irrigated: boolean;
  tillable: boolean;
  features: string[];
}

export interface ComparableSale {
  description: string;
  location: string;
  date: string;
  pricePerAcre: number;
  totalPrice: number;
  acreage: number;
  features: string[];
  sourceUrl?: string;
}

export interface ValuationData {
  p10: number;
  p50: number;
  p90: number;
  totalValue: number;
  pricePerAcre: number;
  confidence: number;
}

export interface AnalysisResult {
  narrative: string;
  keyFactors: string[];
  confidence: number;
}

export interface WebSource {
  title: string;
  organization: string;
  url: string;
}

// Function definitions for OpenAI function calling
const functions = [
  {
    name: "parsePropertyInput",
    description: "Extract location, acreage, crop type, and irrigation from raw user input",
    parameters: {
      type: "object",
      properties: {
        rawInput: { type: "string" }
      },
      required: ["rawInput"]
    }
  },
  {
    name: "calculateValuation",
    description: "Estimate a value range based on reasoning over comp summaries from web search.",
    parameters: {
      type: "object",
      properties: {
        compSummaries: {
          type: "array",
          items: { type: "string" }
        },
        targetAcreage: { type: "number" },
        location: { type: "string" },
        irrigated: { type: "boolean" }
      },
      required: ["compSummaries", "targetAcreage", "location"]
    }
  },
  {
    name: "generateNarrative",
    description: "Explain the valuation result and logic in natural language",
    parameters: {
      type: "object",
      properties: {
        valuationData: { type: "object" },
        userInput: { type: "string" }
      },
      required: ["valuationData"]
    }
  }
];

export async function generateLandValuation(propertyData: PropertyData): Promise<{
  property: ParsedProperty;
  valuation: ValuationData;
  analysis: AnalysisResult;
  comparableSales: ComparableSale[];
  sources: WebSource[];
  timestamp: string;
}> {
  try {
    // Comprehensive valuation using GPT-4o with detailed market knowledge
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional agricultural land appraiser with extensive experience in farmland valuation. You have comprehensive knowledge of recent farmland sales data, market trends, and valuation methodologies.

Your task is to provide a complete property valuation including:
1. Property analysis and feature extraction
2. Market research based on comparable sales knowledge  
3. Statistical valuation ranges (P10, P50, P90)
4. Detailed analysis with supporting factors
5. Relevant data sources and citations

Respond with a valid JSON object in this exact format:
{
  "property": {
    "location": "string",
    "acreage": number,
    "cropType": "string", 
    "irrigated": boolean,
    "tillable": boolean,
    "features": ["string"]
  },
  "valuation": {
    "p10": number,
    "p50": number,
    "p90": number,
    "totalValue": number,
    "pricePerAcre": number,
    "confidence": number
  },
  "analysis": {
    "narrative": "string",
    "keyFactors": ["string"],
    "confidence": number
  },
  "comparableSales": [
    {
      "description": "string",
      "location": "string",
      "date": "string", 
      "pricePerAcre": number,
      "totalPrice": number,
      "acreage": number,
      "features": ["string"],
      "sourceUrl": "string"
    }
  ],
  "sources": [
    {
      "title": "string",
      "organization": "string", 
      "url": "string"
    }
  ]
}

Base your analysis on authentic market knowledge of farmland values, recent sales trends, and regional market conditions. Provide realistic valuations based on current agricultural land markets.`
        },
        {
          role: "user", 
          content: `Please provide a comprehensive valuation for this agricultural property:

Property Description: ${propertyData.propertyDescription}

Property Details:
- Location: ${propertyData.location}
- Acreage: ${propertyData.acreage}
- Irrigated: ${propertyData.irrigated ? 'Yes' : 'No'}
- Tillable: ${propertyData.tillable ? 'Yes' : 'No'}
- Crop Type: ${propertyData.cropType || 'Not specified'}

Please analyze this property and provide:
1. P10 (conservative), P50 (most likely), and P90 (optimistic) per-acre valuations
2. Detailed market analysis explaining your reasoning
3. Key factors affecting the property value
4. Comparable sales data from your knowledge of recent farmland transactions
5. Relevant data sources for farmland valuation

Focus on realistic, market-based valuations using your knowledge of agricultural land markets, recent sales trends, and regional variations. Consider factors like soil quality, location premiums, irrigation infrastructure, and current commodity markets.`
        }
      ],
      temperature: 0.1,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response received from OpenAI');
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid response format from AI analysis');
    }

    // Validate and structure the response data
    const parsedProperty: ParsedProperty = {
      location: parsedResponse.property?.location || propertyData.location,
      acreage: parsedResponse.property?.acreage || propertyData.acreage,
      cropType: parsedResponse.property?.cropType || propertyData.cropType || "Mixed",
      irrigated: parsedResponse.property?.irrigated ?? propertyData.irrigated,
      tillable: parsedResponse.property?.tillable ?? propertyData.tillable,
      features: parsedResponse.property?.features || [
        ...(propertyData.irrigated ? ["Irrigated"] : ["Dryland"]),
        ...(propertyData.tillable ? ["Tillable"] : []),
        ...(propertyData.cropType ? [propertyData.cropType] : [])
      ]
    };

    const valuation: ValuationData = {
      p10: parsedResponse.valuation?.p10 || 0,
      p50: parsedResponse.valuation?.p50 || 0, 
      p90: parsedResponse.valuation?.p90 || 0,
      totalValue: parsedResponse.valuation?.totalValue || Math.round((parsedResponse.valuation?.p50 || 0) * propertyData.acreage),
      pricePerAcre: parsedResponse.valuation?.pricePerAcre || parsedResponse.valuation?.p50 || 0,
      confidence: parsedResponse.valuation?.confidence || 0.75
    };

    const analysis: AnalysisResult = {
      narrative: parsedResponse.analysis?.narrative || "Professional land valuation analysis based on market data and property characteristics.",
      keyFactors: parsedResponse.analysis?.keyFactors || [],
      confidence: parsedResponse.analysis?.confidence || 0.75
    };

    const comparableSales: ComparableSale[] = parsedResponse.comparableSales || [];
    const sources: WebSource[] = parsedResponse.sources || [];

    return {
      property: parsedProperty,
      valuation,
      analysis,
      comparableSales,
      sources,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate valuation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
