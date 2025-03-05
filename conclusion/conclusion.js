import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Load JSON data asynchronously
fetch('conclusion.json')
  .then(response => response.json())
  .then(grouped => {
    // Define chart dimensions
    const yLabel = "Medial-Lateral Axis Momement\nAverage Newton-meters"; //find a way to split into two lines
    const scenarioLabels = {
      "ECL1": "Eyes Closed, Music 0.1Hz",
      "ECR": "Eyes Closed, Music Regular",
      "WL1": "VR shifting, Music 0.1Hz",
      "WR": "VR shifting, Music Regular",
      "WOL1": "VR Stable, Music 0.1Hz",
      "WOR": "VR Stable, Music Regular"
    };

    const width = 700, height = 500, margin = { top: 50, right: 50, bottom: 120, left: 120 };

    // Select the correct SVG (fix)
    const svg = d3.select(".bar")
      .attr("width", width)
      .attr("height", height);

    // X and Y scales
    const x = d3.scaleBand()
      .domain(grouped.map(d => d.Senario))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(grouped, d => d.dMx)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Draw bars
    svg.selectAll(".bar")
      .data(grouped)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.Senario))
      .attr("y", d => y(d.dMx))
      .attr("height", d => y(0) - y(d.dMx))
      .attr("width", x.bandwidth())
      .attr("fill", "steelblue"); // Add color

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d => scenarioLabels[d])) // Custom labels
      .selectAll("text")
      .style("text-anchor", "start")
      .attr("dx", "-1em")
      .attr("dy", "0.8em")
      .attr("transform", "rotate(15)");

    // Add Y axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Y-axis Label
    svg.append("text")
      .attr("transform", `rotate(-90)`)
      .attr("x", -height / 2)
      .attr("y", margin.left / 3)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("class", "axis-label")
      .text(yLabel);

      svg.append("text")
      .attr("class", "annotation")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 70)
      .style("text-anchor", "middle")
      .text("Senario");

    // Add annotation
    svg.append("text")
      .attr("class", "annotation")
      .attr("x", width / 2)
      .attr("y", 20)
      .style("text-anchor", "middle")
      .text("Less environment stability = More movement");
  })
  .catch(error => console.error("Error loading data:", error));
