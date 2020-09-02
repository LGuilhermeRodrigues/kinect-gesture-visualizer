// set the dimensions and margins of the graph

var margin = {top: 30, right: 30, bottom: 75, left: 75},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_container = d3.select("#confusionMatrix svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom).style("border","0px solid red")
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

var actionList = ["Right Punch","Left Punch","Right Kick","Left Kick","Defend","Golf swing","Swing forehand",
    "Swing backhand","Tennis serve", "Throw bowling ball","Aim & shoot","Walk","Run","Jump","Climb","Crouch",
    "Steering wheel","Wave","Flap arms","Clap"]
myGroups = [... actionList]
myVars = actionList.reverse()

// Build X scales and axis:
var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.01);
svg_container.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    // axis label rotation
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

// Build Y scales and axis:
var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.01);
svg_container.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", ".15em")
    .attr("dy", "-0.7em")
    .attr("transform", "rotate(-45)");;

// Build color scale
var myColor = d3.scaleLinear()
    .range(["#e1e6f7", "#0c1869"])
    .domain([0,1])

//Read the data
d3.csv("matrix.csv", function(data) {

    // create a tooltip
    var tooltip = d3.select("#confusionMatrix div")
        .style("visibility", 'hidden')
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    var idGen = d=> d.group.replace(/\s/g, '').replace('&','') +
        d.variable.replace(/\s/g, '').replace('&','')

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        tooltip.style("visibility", 'unset')
        d3.selectAll('.'+idGen(d)).attr('opacity','1')
    }
    var mousemove = function(d) {
        var x_position = parseFloat(d3.select(this).attr("x"))+90
        // console.log(typeof(x_position))
        // x_position = 240
        tooltip
            .html((d.value*100).toFixed(0)+'%')
            .style("left", x_position.toFixed(0)+"px")
            .style("top", (d3.select(this).attr("y")) + "px")
    }
    var mouseleave = function(d) {
        tooltip.style("visibility", 'hidden')
        d3.selectAll('.'+idGen(d)).attr('opacity','0')
    }

    // add the squares
    svg_container.selectAll()
        .data(data, function(d) {return d.group+':'+d.variable;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.group) })
        .attr("y", function(d) { return y(d.variable) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return myColor(d.value)} )
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    svg_container.append("g")
        .selectAll('line')
        .data(data)
        .enter().append('line').attr('stroke','black').attr('stroke-width',"1px")
        .attr('x1', 0)
        .attr('y1', d=>y(d.variable)+y.bandwidth()/2)
        .attr('x2', d=>x(d.group)+x.bandwidth()/2)
        .attr('y2', d=>y(d.variable)+y.bandwidth()/2)
        .attr('opacity','0')
        .attr('class',d=>'dashed '+ idGen(d))

    svg_container.append("g")
        .selectAll('line')
        .data(data)
        .enter().append('line').attr('stroke','black').attr('stroke-width',"1px")
        .attr('x1', d=>x(d.group)+x.bandwidth()/2)
        .attr('y1', height)
        .attr('x2', d=>x(d.group)+x.bandwidth()/2)
        .attr('y2', d=>y(d.variable)+y.bandwidth()/2)
        .attr('opacity','0')
        .attr('class',d=>'dashed '+ idGen(d))

})
