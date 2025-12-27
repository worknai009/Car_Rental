export const geoFeatures = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "USA",
      properties: { name: "United States" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[/* coordinates would go here */]]
      }
    },
    // For a real app, you should download a "world_countries.json" 
    // and export it here as 'geoFeatures'
  ]
};