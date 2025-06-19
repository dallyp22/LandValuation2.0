import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search, Crosshair, Layers, Info } from "lucide-react";
import { PropertyLocation } from "@/lib/types";

// Mapbox access token
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZHBvbGl2a2EyMiIsImEiOiJjbTk4eG9zczMwODRuMmlweG5od3VzNzJvIn0.JusHL37Lpcp-ojEJyqig4Q";

interface InteractiveMapProps {
  onLocationSelect: (location: PropertyLocation) => void;
  selectedLocation?: PropertyLocation | null;
  className?: string;
}

export function InteractiveMap({ 
  onLocationSelect, 
  selectedLocation, 
  className = "" 
}: InteractiveMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PropertyLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);

  // Load map dynamically
  useEffect(() => {
    const loadMap = async () => {
      try {
        // Dynamic import of mapbox-gl
        const mapboxgl = await import('mapbox-gl');
        
        // Import CSS
        await import('mapbox-gl/dist/mapbox-gl.css');
        
        if (mapContainerRef.current) {
          const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            accessToken: MAPBOX_ACCESS_TOKEN,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [-98.5795, 39.8283], // Center of US
            zoom: 4
          });

          map.on('load', () => {
            setMapLoaded(true);
          });

          map.on('click', (event: any) => {
            const { lng, lat } = event.lngLat;
            reverseGeocode(lng, lat).then(address => {
              const newLocation: PropertyLocation = {
                id: `location_${Date.now()}`,
                latitude: lat,
                longitude: lng,
                address: address || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                description: "Click to add property details"
              };
              onLocationSelect(newLocation);
            });
          });

          mapRef.current = map;
        }
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    loadMap();
  }, []);

  // Update marker when selected location changes
  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker
      const mapboxgl = require('mapbox-gl');
      markerRef.current = new mapboxgl.Marker({
        color: '#3b82f6',
        scale: 1.2
      })
        .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
        .addTo(mapRef.current);

      // Fly to location
      mapRef.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 14
      });
    }
  }, [selectedLocation]);

  // Reverse geocoding function
  const reverseGeocode = async (lng: number, lat: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=address,poi`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
      return "";
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return "";
    }
  };

  // Search for locations
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=US&types=address,poi`
      );
      const data = await response.json();
      
      const results: PropertyLocation[] = data.features.map((feature: any, index: number) => ({
        id: `search_${index}`,
        latitude: feature.center[1],
        longitude: feature.center[0],
        address: feature.place_name,
        description: feature.properties?.category || "Location"
      }));
      
      setSearchResults(results);
      
      // Center map on first result
      if (results.length > 0 && mapRef.current) {
        mapRef.current.flyTo({
          center: [results[0].longitude, results[0].latitude],
          zoom: 12
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result selection
  const handleSearchResultClick = (location: PropertyLocation) => {
    onLocationSelect(location);
    setSearchResults([]);
    setSearchQuery("");
  };

  // Use current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 12
            });
          }
          
          reverseGeocode(longitude, latitude).then(address => {
            const currentLocation: PropertyLocation = {
              id: `current_${Date.now()}`,
              latitude,
              longitude,
              address: address || `Current location`,
              description: "Your current location"
            };
            onLocationSelect(currentLocation);
          });
        },
        (error) => {
          console.error("Geolocation failed:", error);
        }
      );
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Property Location</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
        {showInfo && (
          <p className="text-sm text-gray-600">
            Click on the map to select a property location, or search for an address below.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <Label htmlFor="location-search" className="sr-only">
              Search location
            </Label>
            <Input
              id="location-search"
              placeholder="Search for an address or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            size="sm"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={handleUseCurrentLocation}
            variant="outline"
            size="sm"
            title="Use current location"
          >
            <Crosshair className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="max-h-48 overflow-y-auto">
            <CardContent className="pt-4">
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.address}
                        </p>
                        {result.description && (
                          <p className="text-xs text-gray-500">{result.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map Container */}
        <div className="relative h-96 rounded-lg overflow-hidden border border-gray-200">
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}

          {/* Map Overlay Info */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Layers className="h-3 w-3" />
              <span>Click to select property location</span>
            </div>
          </div>
        </div>

        {/* Selected Location Summary */}
        {selectedLocation && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">
                    Selected Location
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedLocation.address}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
} 