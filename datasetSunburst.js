// from https://observablehq.com/@d3/sunburst

var width = 500

var radius = width / 2

var format = d3.format(",d")

var arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1 - 1)

var partition = data => d3.partition()
    .size([2 * Math.PI, radius])
    (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value))

var autoBox = () => {
    document.body.appendChild(this);
    const {x, y, width, height} = this.getBBox();
    document.body.removeChild(this);
    return [x, y, width, height];
}

d3.json("flare-2.json", data => {

    var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

    var svg = d3.select('.datasetStructure').append("svg").style("border","0px solid black").attr("width",500).attr("height",500).attr("viewBox", "-250 -250 500 500")

    const root = partition(data);
    //console.log(root)
    var arco = svg.append("g")
        .attr("fill-opacity", 0.6)
        .selectAll("path")
        .data(root.descendants().filter(d => d.depth))
        .enter().append('path')
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .on('click',(d)=>{
            if(d.data.id){
                localStorage.setItem("movement_id", d.data.id);
                d3.selectAll('.movementName').text(d.data.name)
            }
        })
        .attr("class",d=>'Depth'+d.depth)
    arco.attr("d", arc)
        .append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    svg.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .selectAll("text")
        .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
        .enter().append('text')
        .attr("transform", function(d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr("dy", "0.35em")
        .text(d => d.data.name);

    //svg.attr("viewBox", autoBox).node();
})
