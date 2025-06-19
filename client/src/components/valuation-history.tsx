import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, TrendingUp, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ValuationHistoryItem {
  id: number;
  propertyDescription: string;
  location: string;
  acreage: string;
  irrigated: boolean;
  tillable: boolean;
  cropType: string | null;
  p10: number;
  p50: number;
  p90: number;
  totalValue: number;
  pricePerAcre: number;
  confidence: string;
  createdAt: string;
}

interface ValuationHistoryProps {
  limit?: number;
  location?: string;
  onViewValuation?: (id: number) => void;
}

export function ValuationHistory({ limit = 10, location, onViewValuation }: ValuationHistoryProps) {
  const { data: valuations, isLoading, error } = useQuery({
    queryKey: location ? ['/api/valuations/location', location, limit] : ['/api/valuations/recent', limit],
    queryFn: async () => {
      const url = location 
        ? `/api/valuations/location/${encodeURIComponent(location)}?limit=${limit}`
        : `/api/valuations/recent?limit=${limit}`;
      const response = await apiRequest("GET", url);
      return response.json() as Promise<ValuationHistoryItem[]>;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>{location ? 'Recent Valuations in Area' : 'Recent Valuations'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Unable to load valuation history. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!valuations || valuations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>{location ? 'Recent Valuations in Area' : 'Recent Valuations'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            {location ? 'No valuations found for this location.' : 'No valuations yet. Create your first valuation!'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>{location ? `Recent Valuations in ${location}` : 'Recent Valuations'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {valuations.map((valuation) => (
            <Card key={valuation.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {valuation.propertyDescription}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{valuation.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{valuation.acreage} acres</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(valuation.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {valuation.acreage} acres
                      </Badge>
                      {valuation.irrigated && (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
                          Irrigated
                        </Badge>
                      )}
                      {valuation.tillable && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                          Tillable
                        </Badge>
                      )}
                      {valuation.cropType && (
                        <Badge variant="secondary" className="text-xs">
                          {valuation.cropType}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-primary">
                      {formatCurrency(valuation.pricePerAcre)}/acre
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(valuation.totalValue)} total
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Range: {formatCurrency(valuation.p10)} - {formatCurrency(valuation.p90)}
                    </div>
                  </div>
                </div>
                
                {onViewValuation && (
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewValuation(valuation.id)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View Details</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {valuations.length >= limit && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Showing {limit} most recent valuations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}