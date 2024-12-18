var features = ee.FeatureCollection([]);

// Create a map
var map = ui.Map();

// Add the map to the UI
ui.root.add(map);

// Register a click handler for the map
map.onClick(function(coords) {
  // Create a point geometry from the clicked coordinates
  var roi = ee.Geometry.Point(coords.lon, coords.lat);
  var marker = ui.Map.Layer(
      ee.Geometry.Point(coords.lon, coords.lat), {color: 'red'}, 'Marker');
  map.layers().set(1, marker);

  // Define a function to calculate NDWI, NDTI, NDCI, WQI, and NDVI
  function calculateIndices(image) {
    var ndwi = image.normalizedDifference(['SR_B3', 'SR_B5']).rename('NDWI');  // Green, NIR
    var ndti = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDTI');  // SWIR 1, Red
    var ndci = image.normalizedDifference(['SR_B6', 'SR_B4']).rename('NDCI');  // SWIR 2, Red
    var wqi = ndwi.multiply(0.54).add(ndti.multiply(0.33)).add(ndci.multiply(0.13)).rename('WQI');
    var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');  // NIR, Red
  
    return image.addBands([ndwi, ndti, ndci, wqi, ndvi]);
  }

  // Get the start and end dates from the user
  var startDate = prompt('Enter the start date in YYYY-MM-DD format:');
  var endDate = prompt('Enter the end date in YYYY-MM-DD format:');

  // Load Landsat 8 Surface Reflectance imagery and apply the index function
  var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterBounds(roi)
    .filterDate(startDate, endDate)
    .map(calculateIndices);

  // Reduce the collection to a single image by taking the median
  var image = collection.median();

  // Add NDWI, NDTI, NDCI, WQI, and NDVI layers to the map only for the ROI
  var ndwiVis = {min: -1, max: 1, palette: ['blue', 'white', 'green']};
  var ndtiVis = {min: -1, max: 1, palette: ['white', 'yellow', 'red']};
  var ndciVis = {min: -1, max: 1, palette: ['white', 'purple', 'blue']};
  var wqiVis = {min: 0, max: 100, palette: ['red', 'yellow', 'green']};
  var ndviVis = {min: -1, max: 1, palette: ['blue', 'white', 'green']};
  
  map.addLayer(image.select('NDWI').clip(roi), ndwiVis, 'NDWI');
  map.addLayer(image.select('NDTI').clip(roi), ndtiVis, 'NDTI');
  map.addLayer(image.select('NDCI').clip(roi), ndciVis, 'NDCI');
  map.addLayer(image.select('WQI').clip(roi), wqiVis, 'WQI');
  map.addLayer(image.select('NDVI').clip(roi), ndviVis, 'NDVI');
  
  // Convert the image to a feature collection
  var fc = image.reduceRegions({
    collection: roi,
    reducer: ee.Reducer.mean(),
    scale: 30
  });

  // Print the feature collection to the console
  print(fc);

  // Create charts and add them to the UI
  var ndwiChart = ui.Chart.image.series({
    imageCollection: collection.select(['NDWI']),
    region: roi,
    reducer: ee.Reducer.mean(),
    scale: 30
  }).setOptions({
    title: 'NDWI - Created by Anshuman Pandey',
    vAxis: {
      title: 'Index value',
      format: '0.0'
    },
    hAxis: {
      title: 'Date',
      format: 'YYYY-MM-dd'
    },
    colors: ['blue'],
    lineWidth: 2
  });

  var ndtiChart = ui.Chart.image.series({
    imageCollection: collection.select(['NDTI']),
    region: roi,
    reducer: ee.Reducer.mean(),
    scale: 30
  }).setOptions({
    title: 'NDTI - Created by Anshuman Pandey',
    vAxis: {
      title: 'Index value',
      format: '0.0'
    },
    hAxis: {
      title: 'Date',
      format: 'YYYY-MM-dd'
    },
    colors: ['yellow'],
    lineWidth: 2
  });

  var ndciChart = ui.Chart.image.series({
    imageCollection: collection.select(['NDCI']),
    region: roi,
    reducer: ee.Reducer.mean(),
    scale: 30
  }).setOptions({
    title: 'NDCI - Created by Anshuman Pandey',
    vAxis: {
      title: 'Index value',
      format: '0.0'
    },
    hAxis: {
      title: 'Date',
      format: 'YYYY-MM-dd'
    },
    colors: ['purple'],
    lineWidth: 2
  });

  var wqiChart = ui.Chart.image.series({
    imageCollection: collection.select(['WQI']),
    region: roi,
    reducer: ee.Reducer.mean(),
    scale: 30
  }).setOptions({
    title: 'WQI - Created by Anshuman Pandey',
    vAxis: {
      title: 'Index value',
      format: '0.0'
    },
    hAxis: {
      title: 'Date',
      format: 'YYYY-MM-dd'
    },
    colors: ['green'],
    lineWidth: 2
  });

  var ndviChart = ui.Chart.image.series({
    imageCollection: collection.select(['NDVI']),
    region: roi,
    reducer: ee.Reducer.mean(),
    scale: 30
  }).setOptions({
    title: 'NDVI - Created by Anshuman Pandey',
    vAxis: {
      title: 'NDVI value',
      format: '0.0'
    },
    hAxis: {
      title: 'Date',
      format: 'YYYY-MM-dd'
    },
    colors: ['green'],
    lineWidth: 2
  });

  // Add charts to the UI
  ui.root.widgets().add(ndwiChart);
  ui.root.widgets().add(ui.Label('Feature collection:'));
  ui.root.widgets().add(ndciChart);
  ui.root.widgets().add(ui.Label('Feature collection:'));
  ui.root.widgets().add(ndtiChart);
  ui.root.widgets().add(ui.Label('Feature collection:'));
  ui.root.widgets().add(wqiChart);
  ui.root.widgets().add(ui.Label('Feature collection:'));
  ui.root.widgets().add(ndviChart);
  ui.root.widgets().add(ui.Label('Feature collection:'));
});

// Display instructions to the user
var instructions = 'Click on the map to select a location and get vegetation and water quality information.';
ui.root.add(ui.Label(instructions));