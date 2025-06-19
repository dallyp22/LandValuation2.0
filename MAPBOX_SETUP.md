# Mapbox Integration Setup

This app now includes interactive maps for property location selection. To use this feature, you'll need to set up a Mapbox access token.

## Getting a Mapbox Access Token

1. **Sign up for Mapbox** (Free tier available):
   - Go to [https://account.mapbox.com/](https://account.mapbox.com/)
   - Create a free account
   - The free tier includes 50,000 map loads per month

2. **Get your access token**:
   - After signing up, go to your account dashboard
   - Copy your default public access token
   - It will look like: `pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImN...`

## Setting Up the Token

### Option 1: Environment Variable (Recommended)
Add your Mapbox token to your environment variables:

```bash
# Add to your .env file or environment
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImN...
```

Then update the `client/src/components/interactive-map.tsx` file:

```typescript
// Replace this line:
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example";

// With this:
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN || "your_token_here";
```

### Option 2: Direct Replacement
Replace the placeholder token in `client/src/components/interactive-map.tsx`:

```typescript
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImN..."; // Your actual token
```

## Features Included

The interactive map includes:

- **Click to Select**: Click anywhere on the map to select a property location
- **Address Search**: Search for specific addresses or locations
- **Current Location**: Use your current GPS location
- **Reverse Geocoding**: Automatically get addresses from map clicks
- **Visual Markers**: See selected locations with custom markers
- **Responsive Design**: Works on desktop and mobile devices

## Usage

1. **Select Location**: Click on the map or search for an address
2. **Auto-fill**: The location field will automatically populate with the selected address
3. **Continue**: Fill in the rest of your property details and get your valuation

## Troubleshooting

- **Map not loading**: Check that your Mapbox token is valid and has sufficient quota
- **Search not working**: Ensure your token has geocoding permissions enabled
- **Styling issues**: Make sure the Mapbox CSS is properly imported

## Cost Considerations

- **Free Tier**: 50,000 map loads per month
- **Paid Plans**: Start at $5/month for additional usage
- **Geocoding**: Included in the free tier with reasonable limits

For most users, the free tier will be more than sufficient for testing and moderate usage. 