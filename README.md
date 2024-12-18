# Interactive Map for Environmental Indices Analysis Using Google Earth Engine

## Project Overview
This project is an interactive application built using Google Earth Engine (GEE) that allows users to analyze and visualize environmental indices such as NDWI, NDVI, and WQI by selecting any location on a map. The project is aimed at providing insights into water and vegetation quality through remote sensing data.

## Features
1. **Interactive Map**:
   - Users can click on any location to define a Region of Interest (ROI).
   - The selected location is marked with a red marker on the map.

2. **Environmental Indices Calculated**:
   - **NDWI (Normalized Difference Water Index)**: Measures water content.
   - **NDTI (Normalized Difference Tillage Index)**: Reflects surface material properties.
   - **NDCI (Normalized Difference Chlorophyll Index)**: Assesses water chlorophyll concentration.
   - **WQI (Water Quality Index)**: Aggregates water-related indices into a single metric.
   - **NDVI (Normalized Difference Vegetation Index)**: Represents vegetation health.

3. **Remote Sensing Data**:
   - Uses **Landsat 8 Surface Reflectance imagery** for calculations.
   - Allows filtering of imagery based on user-defined date ranges.

4. **Visualization**:
   - Displays each index as a color-coded layer on the map.
   - Provides temporal trends through interactive charts.

5. **Data Analysis**:
   - Generates a feature collection summarizing index values for the selected ROI.
   - Outputs the feature collection to the GEE console.

## Technology Used
- **Google Earth Engine (GEE)**: For accessing remote sensing data and processing.
- **JavaScript**: For implementing the logic and UI of the project.
- **GEE UI Library**: For creating an interactive user interface with charts and maps.

## How It Works
1. The user clicks on the map to define an ROI.
2. The application calculates indices using Landsat 8 imagery for the selected location.
3. The user inputs a date range, and imagery within this period is processed.
4. The calculated indices are visualized on the map and displayed in temporal trend charts.
5. The feature collection of index values is output to the console for further analysis.

## Usage Instructions
1. Clone this repository to your local system.
2. Open the project in Google Earth Engine Code Editor.
3. Run the script to load the map interface.
4. Follow the instructions displayed in the application:
   - Click on the map to select a location.
   - Enter the desired start and end dates when prompted.
5. View the calculated indices on the map and their temporal trends in the charts.
6. Analyze the feature collection values in the GEE console.

## Key Code Snippets
### Index Calculation Function:
```javascript
function calculateIndices(image) {
  var ndwi = image.normalizedDifference(['SR_B3', 'SR_B5']).rename('NDWI');
  var ndti = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDTI');
  var ndci = image.normalizedDifference(['SR_B6', 'SR_B4']).rename('NDCI');
  var wqi = ndwi.multiply(0.54).add(ndti.multiply(0.33)).add(ndci.multiply(0.13)).rename('WQI');
  var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
  return image.addBands([ndwi, ndti, ndci, wqi, ndvi]);
}
```

### Visualization Settings:
```javascript
var ndwiVis = {min: -1, max: 1, palette: ['blue', 'white', 'green']};
var ndtiVis = {min: -1, max: 1, palette: ['white', 'yellow', 'red']};
var ndciVis = {min: -1, max: 1, palette: ['white', 'purple', 'blue']};
var wqiVis = {min: 0, max: 100, palette: ['red', 'yellow', 'green']};
var ndviVis = {min: -1, max: 1, palette: ['blue', 'white', 'green']};
```

## Applications
- **Environmental Monitoring**: Analyze vegetation and water quality changes over time.
- **Urban Planning**: Assess the impact of urbanization on natural resources.
- **Research**: Use as a tool for remote sensing studies in hydrology and ecology.

## Author
**Anshuman Pandey**  
_Developed as part of a geospatial analysis project._

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements
- Google Earth Engine for providing the platform and data.
- Landsat program for the satellite imagery.

---
