d3.csv("f1results.csv", function(data) {

    var barChartContainer = d3.select('#categoryResults svg')

    var margin = ({top: 30, right: 0, bottom: 30, left: 40})

    var width = 700

    var x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.25)

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.f1)]).nice()
        .range([height - margin.bottom, margin.top])

    var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, 8))

    barChartContainer.append("g")
        .attr("fill", "steelblue")
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(d.f1))
            .attr("height", d => y(0) - y(d.f1))
            .attr("width", x.bandwidth())
            .attr('fill',d=>color(d.scenario))
            .attr('opacity',0.85);


    var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i].action).tickSizeOuter(0))

    barChartContainer.append("g")
        .call(xAxis).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, '%'))
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text('F1 Score'))

    barChartContainer.append("g")
        .call(yAxis);





})