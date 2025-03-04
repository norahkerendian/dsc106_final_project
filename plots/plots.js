// document.addEventListener("DOMContentLoaded", function () {
//     const subjects = Array.from({ length: 10 }, (_, i) => i + 1);
//     const fileNames = ["ECL1", "ECR", "WL1", "WR"];
//     const subjectSelect = document.getElementById("subject-select");
//     const fileSelect = document.getElementById("file-select");
    
//     // Populate dropdown
//     subjects.forEach(subject => {
//         const option = document.createElement("option");
//         option.value = subject;
//         option.textContent = `Subject ${subject}`;
//         subjectSelect.appendChild(option);
//     });

//     fileNames.forEach(fileName => {
//         const option = document.createElement("option");
//         option.value = fileName;
//         option.textContent = fileName;
//         fileSelect.appendChild(option);
//     });

//     const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    
//     // Dynamically get the width and height of the plot container
//     const svg = d3.select("#plot-container");
//     const plotContainer = document.getElementById("plot-container-wrapper");

//     // Function to get dynamic width and height
//     function getDimensions() {
//         const width = plotContainer.clientWidth - margin.left - margin.right;
//         const height = plotContainer.clientHeight - margin.top - margin.bottom;
//         return { width, height };
//     }

//     function loadData(subject, fileName) {
//         const file = `../data/S${subject}/${fileName}.csv`; // Dynamically select file
//         console.log(`Loading: ${file}`);

//         d3.csv(file).then(data => {
//             console.log("Data loaded:", data);  // Log data to ensure it's loaded correctly

//             // Calculate mean and deviation just once
//             const meanCoPx = d3.mean(data, d => +d.CoPx);
//             const devCoPx = d3.deviation(data, d => +d.CoPx);
//             const meanCoPy = d3.mean(data, d => +d.CoPy);
//             const devCoPy = d3.deviation(data, d => +d.CoPy);

//             // Normalize values
//             data.forEach(d => {
//                 d.CoPx = (+d.CoPx - meanCoPx) / devCoPx;
//                 d.CoPy = (+d.CoPy - meanCoPy) / devCoPy;
//             });

//             // Call updatePlot after processing the data
//             updatePlot(data);
//         }).catch(error => {
//             console.error('Error loading CSV file:', error);
//         });
//     }
    
//     function updatePlot(data) {
//         svg.selectAll("*").remove();

//         const { width, height } = getDimensions();

//         const xScale = d3.scaleLinear()
//             .domain([0,60])
//             // .domain(d3.extent(data, d => d.Time))
//             .range([0, width]);

//         const yScale = d3.scaleLinear()
//             .domain(d3.extent(data, d => Math.max(Math.abs(d.CoPx), Math.abs(d.CoPy))))
//             // .domain([-5, 5]) // Normalized range
//             .range([height, 0]);

//         const lineX = d3.line()
//             .x(d => xScale(d.Time))
//             .y(d => yScale(d.CoPx));

//         const lineY = d3.line()
//             .x(d => xScale(d.Time))
//             .y(d => yScale(d.CoPy));

//         svg.append("path")
//             .datum(data)
//             .attr("fill", "none")
//             .attr("stroke", "blue")
//             .attr("stroke-width", 2)
//             .attr("d", lineX);

//         svg.append("path")
//             .datum(data)
//             .attr("fill", "none")
//             .attr("stroke", "green")
//             .attr("stroke-width", 2)
//             .attr("d", lineY);

//         svg.append("g")
//             .attr("transform", `translate(0,${height})`)
//             .call(d3.axisBottom(xScale));

//         svg.append("g")
//             .call(d3.axisLeft(yScale));
//     }

//     // Event listener for when the file or subject changes
//     subjectSelect.addEventListener("change", function () {
//         loadData(subjectSelect.value, fileSelect.value);
//     });

//     fileSelect.addEventListener("change", function () {
//         loadData(subjectSelect.value, fileSelect.value);
//     });

//     // Load initial data with the first subject and file
//     loadData(subjects[0], fileNames[0]);
// });

// Set up the dimensions and margins of the graph
// const margin = {top: 20, right: 30, bottom: 50, left: 60},
//       width = 800 - margin.left - margin.right,
//       height = 400 - margin.top - margin.bottom;

// // Append the SVG object to the body of the page
// const svg = d3.select("#plot-container").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

// // Load the CSV file
// d3.csv("../data/S1/ECL1.csv").then(function(data) {
//     // Convert numerical values
//     data.forEach(d => {
//         d.Time = +d.Time;
//         d.CoPx = +d.CoPx;
//         d.CoPy = +d.CoPy;
//         d.Mx = +d.Mx;
//         d.My = +d.My;
//     });

//     let currentDataset = 'cop';

//     // Scales
//     const x = d3.scaleLinear()
//         .domain(d3.extent(data, d => d.Time))
//         .range([0, width]);

//     const y = d3.scaleLinear()
//         .domain([d3.min(data, d => Math.min(d.CoPx, d.CoPy, d.Mx, d.My)),
//                  d3.max(data, d => Math.max(d.CoPx, d.CoPy, d.Mx, d.My))])
//         .range([height, 0]);

//     // Axes
//     svg.append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(x));

//     const yAxis = svg.append("g")
//         .call(d3.axisLeft(y));

//     // Line generators
//     const lineX = d3.line()
//         .x(d => x(d.Time))
//         .y(d => y(d.CoPx));

//     const lineY = d3.line()
//         .x(d => x(d.Time))
//         .y(d => y(d.CoPy));

//     // Append lines
//     const pathX = svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "blue")
//         .attr("stroke-width", 2)
//         .attr("d", lineX);

//     const pathY = svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "green")
//         .attr("stroke-width", 2)
//         .attr("d", lineY);

//     // Toggle button
//     d3.select("body").append("button")
//         .text("Toggle Data")
//         .on("click", function() {
//             currentDataset = currentDataset === 'cop' ? 'm' : 'cop';
//             updateChart();
//         });

//     function updateChart() {
//         if (currentDataset === 'cop') {
//             pathX.datum(data).transition().duration(1000).attr("d", lineX);
//             pathY.datum(data).transition().duration(1000).attr("d", lineY);
//         } else {
//             pathX.datum(data).transition().duration(1000).attr("d", d3.line()
//                 .x(d => x(d.Time))
//                 .y(d => y(d.Mx)));
//             pathY.datum(data).transition().duration(1000).attr("d", d3.line()
//                 .x(d => x(d.Time))
//                 .y(d => y(d.My)));
//         }
//     }
// });

// Set SVG dimensions
const width = 800, height = 400, margin = 50;
const svg = d3.select("svg");

let isCOP = true; // Track whether we're showing CoP or Mx/My

// Load CSV file
d3.csv("../data/S1/ECL1.csv").then(data => {
    data.forEach(d => {
        d.Time = +d.Time;
        d.CoPx = +d.CoPx;
        d.CoPy = +d.CoPy;
        d.Mx = +d.Mx;
        d.My = +d.My;
    });

    // Function to normalize values
    function normalize(data, key) {
        const mean = d3.mean(data, d => d[key]);
        const std = d3.deviation(data, d => d[key]);
        return data.map(d => ({ Time: d.Time, value: (d[key] - mean) / std }));
    }

    // Initial dataset
    let normalizedDataX = normalize(data, "CoPx");
    let normalizedDataY = normalize(data, "CoPy");

    // Create scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Time))
        .range([margin, width - margin]);

    const yScale = d3.scaleLinear()
        .domain([-5, 5]) // Assuming normalization keeps data in this range
        .range([height - margin, margin]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .call(yAxis);

    // Line generator
    const lineGen = d3.line()
        .x(d => xScale(d.Time))
        .y(d => yScale(d.value));

    // Draw lines
    const pathX = svg.append("path")
        .datum(normalizedDataX)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", lineGen);

    const pathY = svg.append("path")
        .datum(normalizedDataY)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", lineGen);

    // Button event listener
    d3.select("#toggleButton").on("click", () => {
        isCOP = !isCOP; // Toggle dataset

        // Update data
        const newDataX = normalize(data, isCOP ? "CoPx" : "Mx");
        const newDataY = normalize(data, isCOP ? "CoPy" : "My");

        // Update paths
        pathX.datum(newDataX).transition().duration(500).attr("d", lineGen);
        pathY.datum(newDataY).transition().duration(500).attr("d", lineGen);

        // Update button text
        d3.select("#toggleButton").text(isCOP ? "Switch to Mx/My" : "Switch to CoPx/CoPy");
    });
});
