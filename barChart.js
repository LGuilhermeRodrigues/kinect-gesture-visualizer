d3.csv("f1results.csv", function(data) {

    var barChartContainer = d3.select('#categoryResults svg')

    var margin = ({top: 30, right: 100, bottom: 40, left: 40})

    var width = 700

    var x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.25)

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.f1)]).nice()
        .range([height - margin.bottom, margin.top])

    var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, 8))

    barChartContainer.append('text')
        .attr("x", width-margin.right/2)
        .attr("y", margin.top)
        .attr("fill", "currentColor")
        .attr('font-size','11px')
        .attr("text-anchor", "middle")
        .text('Scenarios')

    var legendaEntries = data.reduce((r,a)=>r.indexOf(a.scenario)===-1?[...r, a.scenario]:[...r],[])

    var legendaContainer = barChartContainer.append("g")
        legendaContainer.selectAll('rect').data(legendaEntries)
        .enter().append('rect')
        .attr("x", width-100)
        .attr("y", (d,i)=>40+i*20)
        .attr("height", 10)
        .attr("width", 10)
        .attr('fill',d=>color(d))
        legendaContainer.selectAll('text').data(legendaEntries)
        .enter().append('text')
            .attr('font-size','11px')
            .attr("x", width-100+12)
            .attr("y", (d,i)=>40+i*20+8)
        .text(d=>d)

    var mouseOver = function(d) {
        //selecionar linha correspondente e .attr('opacity','1')
        d3.selectAll('.'+d.action.replace(/\s/g, '').replace('&','')).attr('opacity','1')
    }

    var mouseLeave = function(d) {
        //selecionar linha correspondente e .attr('opacity','0')
        d3.selectAll('.'+d.action.replace(/\s/g, '').replace('&','')).attr('opacity','0')
    }

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
            .attr('opacity',0.85)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave);

    // linhas
    barChartContainer.append("g").selectAll('line')
        .data(data)
        .enter().append('line').attr('stroke','black').attr('stroke-width',"1px")
        .attr('x1', function(d){ return margin.left})
        .attr('y1', function(d){ return y(d.f1)})
        .attr('x2', function(d, i){ return x(i)})
        .attr('y2', function(d){ return y(d.f1)}).attr('opacity','0').attr('class',d=>'dashed '+d.action.replace(/\s/g, '').replace('&',''))

    barChartContainer.append("g").selectAll('text').data(data)
        .enter().append('text')
        .attr('class',d=>d.action.replace(/\s/g, '').replace('&',''))
        .text(d=>(d.f1*100).toFixed(0)+'%')
        .attr('text-anchor', 'middle')
        .attr("y",d => y(d.f1) - 5)
        .attr("x", (d, i)=>x(i)+x.bandwidth()/2).attr('opacity','0')

    var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i].action).tickSizeOuter(0))
    barChartContainer.append("text")
            .attr("x", width-margin.right+5)
            .attr("y", height-margin.bottom)
            .attr("fill", "currentColor")
            .attr('font-size','11px')
            .attr("alignment-baseline", "middle")
            .text('Actions')

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