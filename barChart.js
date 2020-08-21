d3.csv("f1results.csv", function(data) {

    var barChartContainer = d3.select('#categoryResults svg')

    var x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.f1)]).nice()
        .range([height - margin.bottom, margin.top])

    barChartContainer.append("g")
        .attr("fill", "steelblue")
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
            .attr("x", (d)=>100)
            .attr("y", (d)=>100)
            .attr('width',(d)=>100)
            .attr('height',(d)=>100)


    //var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

})