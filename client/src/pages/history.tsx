import { useState } from "react";
import { ValuationHistory } from "@/components/valuation-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Search, MapPin, TrendingUp } from "lucide-react";

export default function HistoryPage() {
  const [searchLocation, setSearchLocation] = useState("");
  const [activeLocation, setActiveLocation] = useState<string | undefined>();

  const handleLocationSearch = () => {
    if (searchLocation.trim()) {
      setActiveLocation(searchLocation.trim());
    }
  };

  const clearLocationFilter = () => {
    setActiveLocation(undefined);
    setSearchLocation("");
  };

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
                <p className="text-xs text-gray-500">Valuation History</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                New Valuation
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <History className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Valuation History</h2>
          </div>
          <p className="text-gray-600">
            Browse past property valuations and market analysis reports.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search by Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  placeholder="e.g., Hamilton County, NE or Hastings, NE"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                />
              </div>
              <Button onClick={handleLocationSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {activeLocation && (
                <Button variant="outline" onClick={clearLocationFilter}>
                  Clear Filter
                </Button>
              )}
            </div>
            
            {activeLocation && (
              <div className="mt-3 flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>Filtered by: {activeLocation}</span>
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Market Activity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Valuations</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unique Locations</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <History className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Valuation History */}
        <ValuationHistory 
          limit={20} 
          location={activeLocation}
          onViewValuation={(id) => {
            // TODO: Navigate to detailed valuation view
            console.log('View valuation:', id);
          }}
        />
      </div>
    </div>
  );
}