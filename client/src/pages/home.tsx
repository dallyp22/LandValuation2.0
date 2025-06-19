import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { PropertyForm } from "@/components/property-form";
import { ValuationResults } from "@/components/valuation-results";
import { ValuationHistory } from "@/components/valuation-history";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Bot } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PropertyFormData, ValuationResult } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<ValuationResult | null>(null);
  const { toast } = useToast();

  const valuationMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      const response = await apiRequest("POST", "/api/valuations", data);
      return response.json();
    },
    onSuccess: (data: ValuationResult) => {
      setResult(data);
      toast({
        title: "Valuation Complete",
        description: "Your property valuation has been generated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Valuation Failed",
        description: error.message || "Please check your input and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: PropertyFormData) => {
    valuationMutation.mutate(data);
  };

  const handleNewValuation = () => {
    setResult(null);
  };

  const isLoading = valuationMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LandIQ</h1>
                <p className="text-xs text-gray-500">Real-Time Land Valuation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <Bot className="h-4 w-4 text-primary" />
                <span>Powered by GPT-4.1 + Web Search</span>
              </div>
              <a 
                href="/history" 
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                History
              </a>
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <AlertCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Input Form with Map */}
          <div className="xl:col-span-7">
            <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Results Panel */}
          <div className="xl:col-span-5">
            {isLoading && (
              <Card>
                <CardContent className="pt-8 pb-8">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Property</h3>
                    <p className="text-gray-600 mb-4">Searching for comparable sales data...</p>
                    <Card className="bg-gray-50">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Searching web for current market data...</span>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-emerald-500 rounded-full animate-spin"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && !isLoading && (
              <ValuationResults result={result} onNewValuation={handleNewValuation} />
            )}

            {!result && !isLoading && (
              <Card>
                <CardContent className="pt-8 pb-8">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Value Your Land</h3>
                    <p className="text-gray-600">
                      Select a location on the map and enter your property details to get started with a real-time valuation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Valuations Preview */}
        {!isLoading && (
          <div className="mt-12">
            <ValuationHistory 
              limit={5}
              onViewValuation={(id) => {
                window.location.href = "/history";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
