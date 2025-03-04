// THIS WORKS:

const width = 800, height = 400, margin = 50;
const svg = d3.select("svg");
let isCOP = true; // Track whether we're showing CoP or Mx/My

const subjects = Array.from({ length: 10 }, (_, i) => i + 1);
const fileNames = ["ECL1", "ECR", "WL1", "WR"];
const subjectSelect = d3.select("#subject-select");
const fileSelect = d3.select("#file-select");

// Populate dropdowns
subjects.forEach(subject => {
    subjectSelect.append("option")
        .attr("value", subject)
        .text(`Subject ${subject}`);
});

fileNames.forEach(fileName => {
    fileSelect.append("option")
        .attr("value", fileName)
        .text(fileName);
});

// Function to load and plot data
function loadAndPlotData(subject, file) {
    const filePath = `../data/S${subject}/${file}.csv`;

    d3.csv(filePath).then(data => {
        data.forEach(d => {
            d.Time = +d.Time;
            d.CoPx = +d.CoPx;
            d.CoPy = +d.CoPy;
            d.Mx = +d.Mx;
            d.My = +d.My;
        });

        // Normalize function
        function normalize(data, key) {
            const mean = d3.mean(data, d => d[key]);
            const std = d3.deviation(data, d => d[key]);
            return data.map(d => ({ Time: d.Time, value: (d[key] - mean) / std }));
        }

        let normalizedDataX = normalize(data, "CoPx");
        let normalizedDataY = normalize(data, "CoPy");

        // Create scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.Time))
            .range([margin, width - margin]);

        const yScale = d3.scaleLinear()
            .domain([-5, 5])
            .range([height - margin, margin]);

        // Clear previous plot
        svg.selectAll("*").remove();

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

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 100}, 30)`); // Adjust position as needed

        // Create legend items
        const legendItems = [
            { color: "blue", label: "CoPx" },
            { color: "green", label: "CoPy" }
        ];

        const updateLegend = () => {
            // Clear previous legend
            legend.selectAll("*").remove();

            // Add updated legend items
            legendItems.forEach((item, index) => {
                legend.append("rect")
                    .attr("x", 0)
                    .attr("y", index * 20)
                    .attr("width", 12)
                    .attr("height", 12)
                    .attr("fill", item.color);

                legend.append("text")
                    .attr("x", 15)
                    .attr("y", index * 20 + 12)
                    .text(item.label)
                    .style("font-size", "12px")
                    .attr("alignment-baseline", "middle");
            });
        };

        updateLegend();

        // Button event listener
        d3.select("#toggleButton").on("click", () => {
            isCOP = !isCOP; // Toggle dataset

            const newDataX = normalize(data, isCOP ? "CoPx" : "Mx");
            const newDataY = normalize(data, isCOP ? "CoPy" : "My");

            pathX.datum(newDataX).transition().duration(500).attr("d", lineGen);
            pathY.datum(newDataY).transition().duration(500).attr("d", lineGen);

            d3.select("#toggleButton").text(isCOP ? "Switch to Mx/My" : "Switch to CoPx/CoPy");

            // Update legend based on the toggle state
            legendItems[0].label = isCOP ? "CoPx" : "Mx";
            legendItems[1].label = isCOP ? "CoPy" : "My";
            legendItems[0].color = isCOP ? "blue" : "blue";
            legendItems[1].color = isCOP ? "green" : "green";

            updateLegend(); // Update the legend
        });
    }).catch(error => console.error("Error loading file:", error));
}

// Load initial data
const initialSubject = subjectSelect.node().value;
const initialFile = fileSelect.node().value;
loadAndPlotData(initialSubject, initialFile);

// Update plot when dropdowns change
subjectSelect.on("change", function () {
    const selectedSubject = d3.select(this).property("value");
    const selectedFile = fileSelect.property("value");
    isCOP = true;
    d3.select("#toggleButton").text("Switch to Mx/My");
    loadAndPlotData(selectedSubject, selectedFile);
});

fileSelect.on("change", function () {
    const selectedSubject = subjectSelect.property("value");
    const selectedFile = d3.select(this).property("value");
    isCOP = true;
    d3.select("#toggleButton").text("Switch to Mx/My");
    loadAndPlotData(selectedSubject, selectedFile);
});
