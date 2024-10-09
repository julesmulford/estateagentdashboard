// script.js
async function fetchData() {
  const zipCode = document.getElementById('zipCodeInput').value;

  if (!zipCode) {
    alert("Please enter a ZIP code.");
    return;
  }

  // Fetch data from your backend API
  try {
    const response = await fetch(`https://api.yourdomain.com/data?zip=${zipCode}`);
    const data = await response.json();

    renderPriceChart(data.priceData);
    renderCrimeChart(data.crimeData);
    renderSchoolChart(data.schoolData);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Error retrieving data. Please try again.");
  }
}

// D3.js function for price trend chart
function renderPriceChart(priceData) {
  d3.select("#priceChart").html(""); // Clear previous chart

  const svg = d3.select("#priceChart").append("svg")
    .attr("width", 400)
    .attr("height", 300);

  const x = d3.scaleBand().range([0, 400]).padding(0.4),
        y = d3.scaleLinear().range([300, 0]);

  x.domain(priceData.map(d => d.date));
  y.domain([0, d3.max(priceData, d => d.price)]);

  svg.selectAll(".bar")
    .data(priceData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.date))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.price))
    .attr("height", d => 300 - y(d.price));
}

// D3.js function for crime trend chart
function renderCrimeChart(crimeData) {
  d3.select("#crimeChart").html(""); // Clear previous chart

  const svg = d3.select("#crimeChart").append("svg")
    .attr("width", 400)
    .attr("height", 300);

  const x = d3.scaleBand().range([0, 400]).padding(0.4),
        y = d3.scaleLinear().range([300, 0]);

  x.domain(crimeData.map(d => d.year));
  y.domain([0, d3.max(crimeData, d => d.rate)]);

  svg.selectAll(".bar")
    .data(crimeData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.year))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.rate))
    .attr("height", d => 300 - y(d.rate));
}

// D3.js function for school quality trend chart
function renderSchoolChart(schoolData) {
  d3.select("#schoolChart").html(""); // Clear previous chart

  const svg = d3.select("#schoolChart").append("svg")
    .attr("width", 400)
    .attr("height", 300);

  const x = d3.scaleBand().range([0, 400]).padding(0.4),
        y = d3.scaleLinear().range([300, 0]);

  x.domain(schoolData.map(d => d.year));
  y.domain([0, d3.max(schoolData, d => d.rating)]);

  svg.selectAll(".bar")
    .data(schoolData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.year))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.rating))
    .attr("height", d => 300 - y(d.rating));
}

// Checkboxes for toggling metrics
document.getElementById("propertyPriceToggle").addEventListener("change", (e) => toggleLayer("propertyPrice", e.target.checked));
document.getElementById("crimeRateToggle").addEventListener("change", (e) => toggleLayer("crimeRate", e.target.checked));
document.getElementById("schoolQualityToggle").addEventListener("change", (e) => toggleLayer("schoolQuality", e.target.checked));

// Function to toggle layers on/off based on checkbox state
function toggleLayer(metric, isVisible) {
  if (isVisible) {
    layers[metric].addTo(map);
  } else {
    map.removeLayer(layers[metric]);
  }
}

async function init() {
  const metrics = ['propertyPrice', 'crimeRate', 'schoolQuality'];
  for (let metric of metrics) {
    // Fetch data with caching to minimize API calls
    const data = await fetchDataWithCache(metric);
    displayHeatmap(data, metric);  // Display each metric layer based on the cached data
  }
}