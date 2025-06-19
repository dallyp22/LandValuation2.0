import { AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ValuationResults } from "@/components/valuation-results";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import type { ValuationResult } from "@/lib/types";

export default function ValuationDetailPage() {
  const [, params] = useRoute<{ id: string }>("/valuation/:id");
  const [, navigate] = useLocation();
  const id = params?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/valuations", id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/valuations/${id}`);
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Unable to load valuation.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const result: ValuationResult = {
    property: {
      acreage: parseFloat(data.acreage),
      location: data.location,
      features: [
        ...(data.irrigated ? ["Irrigated"] : []),
        ...(data.tillable ? ["Tillable"] : []),
        ...(data.cropType ? [data.cropType] : []),
      ],
    },
    valuation: {
      p10: data.p10,
      p50: data.p50,
      p90: data.p90,
      totalValue: data.totalValue,
      pricePerAcre: data.pricePerAcre,
    },
    analysis: {
      narrative: data.narrative,
      keyFactors: data.keyFactors,
      confidence: parseFloat(data.confidence),
    },
    comparableSales: data.comparableSales,
    sources: data.sources,
    timestamp: data.createdAt,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LandIQ</h1>
                <p className="text-xs text-gray-500">Valuation Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/history" className="text-sm text-gray-600 hover:text-primary transition-colors">
                History
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ValuationResults result={result} onNewValuation={() => navigate("/")} />
      </div>
    </div>
  );
}
