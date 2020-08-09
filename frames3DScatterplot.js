let svg = d3.select('.framesInspector').append("svg")
    .style("border","1px solid black").attr("width",600).attr("height",500)

let data3D = [ [[0,-1,0],[-1,1,0],[1,1,0]] ];

let triangles3D = d3._3d()
    .scale(100)
    .origin([480, 250])
    .shape('TRIANGLE');

let projectedData = triangles3D(data3D);

let init = data => {

    let triangles = svg.selectAll('path').data(data);

    // add your logic here...

}

init(projectedData);
