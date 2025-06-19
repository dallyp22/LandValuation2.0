import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Brain, Search, Link, Download, Share, Plus, ExternalLink } from "lucide-react";
import type { ValuationResult } from "@/lib/types";

interface ValuationResultsProps {
  result: ValuationResult;
  onNewValuation: () => void;
}

export function ValuationResults({ result, onNewValuation }: ValuationResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Valuation Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">Valuation Results</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{formatDate(result.timestamp)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Property Summary */}
          <Card className="bg-gray-50 mb-6">
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {result.property.acreage} acres
                </Badge>
                {result.property.features.map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className={
                      feature === "Irrigated" ? "bg-emerald-100 text-emerald-800" :
                      feature === "Tillable" ? "bg-amber-100 text-amber-800" :
                      "bg-gray-100 text-gray-800"
                    }
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-700">{result.property.location}</p>
            </CardContent>
          </Card>

          {/* Value Range Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-red-50">
              <CardContent className="pt-4 text-center">
                <div className="text-xs font-medium text-red-600 mb-1">P10 (Conservative)</div>
                <div className="text-xl font-bold text-red-700">{formatCurrency(result.valuation.p10)}</div>
                <div className="text-xs text-red-600">per acre</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-2 border-primary/20">
              <CardContent className="pt-4 text-center">
                <div className="text-xs font-medium text-primary mb-1">P50 (Most Likely)</div>
                <div className="text-2xl font-bold text-primary">{formatCurrency(result.valuation.p50)}</div>
                <div className="text-xs text-primary">per acre</div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50">
              <CardContent className="pt-4 text-center">
                <div className="text-xs font-medium text-emerald-600 mb-1">P90 (Optimistic)</div>
                <div className="text-xl font-bold text-emerald-700">{formatCurrency(result.valuation.p90)}</div>
                <div className="text-xs text-emerald-600">per acre</div>
              </CardContent>
            </Card>
          </div>

          {/* Total Value */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total Property Value (P50):</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(result.valuation.totalValue)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GPT Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">AI Analysis</CardTitle>
              <p className="text-gray-600 text-sm">GPT-4.1 with real-time web search insights</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-gray-700">
            {result.analysis.narrative.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
            ))}
          </div>
          
          {result.analysis.keyFactors.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Key Valuation Factors:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {result.analysis.keyFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparable Sales */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Comparable Sales</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.comparableSales.map((sale, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{sale.description}</h4>
                      <p className="text-sm text-gray-600">{sale.location} • {sale.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">{formatCurrency(sale.pricePerAcre)}/acre</div>
                      <div className="text-sm text-gray-500">{formatCurrency(sale.totalPrice)} total</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {sale.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  {sale.sourceUrl && (
                    <a 
                      href={sale.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View source
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {result.comparableSales.length > 3 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                View all comparable sales ({result.comparableSales.length} found)
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Web Sources */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Link className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold text-gray-900">Data Sources</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.sources.map((source, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="pt-3">
                  <div className="flex items-start space-x-3">
                    <ExternalLink className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{source.title}</h4>
                      <p className="text-xs text-gray-600 mb-1">{source.organization}</p>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        {source.url}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button variant="outline" className="flex-1">
          <Share className="h-4 w-4 mr-2" />
          Share Results
        </Button>
        <Button onClick={onNewValuation} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Valuation
        </Button>
      </div>
    </div>
  );
}
