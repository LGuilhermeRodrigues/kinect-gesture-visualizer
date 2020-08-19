let svg = d3.select('.framesInspector svg').attr("width",570).attr("height",460)

d3.select('.framesInspector').attr("width",570)

var origin = [300, 225], j = 10, scale = 20, scatter = [], yLine = [], xGrid = [], beta = 0, alpha = 0, key = function(d){ return d.id; }, startAngle = Math.PI/4;
svg    = d3.select('svg').call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g');
var color  = d3.scaleOrdinal(d3.schemeCategory20);
var mx, my, mouseX, mouseY;

let grid3d = d3._3d()
    .shape('GRID', 20)
    .origin(origin)
    .rotateY( startAngle)
    .rotateX(-startAngle)
    .scale(scale);

var point3d = d3._3d()
    .x(function(d){ return d.x; })
    .y(function(d){ return d.y; })
    .z(function(d){ return d.z; })
    .origin(origin)
    .rotateY( startAngle)
    .rotateX(-startAngle)
    .scale(scale);

var yScale3d = d3._3d()
    .shape('LINE_STRIP')
    .origin(origin)
    .rotateY( startAngle)
    .rotateX(-startAngle)
    .scale(scale);

function processData(data, tt){

    /* ----------- GRID ----------- */

    var xGrid = svg.selectAll('path.grid').data(data[0], key);

    xGrid
        .enter()
        .append('path')
        .attr('class', '_3d grid')
        .merge(xGrid)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.3)
        .attr('fill', function(d){ return d.ccw ? 'lightgrey' : '#717171'; })
        .attr('fill-opacity', 0.9)
        .attr('d', grid3d.draw);

    xGrid.exit().remove();

    /* ----------- POINTS ----------- */

    var points = svg.selectAll('circle').data(data[1], key);

    points
        .enter()
        .append('circle')
        .attr('class', '_3d')
        .attr('opacity', 0)
        .attr('cx', posPointX)
        .attr('cy', posPointY)
        .merge(points)
        .transition().duration(tt)
        .attr('r', 3)
        .attr('stroke', function(d){ return d3.color(color(d.id)).darker(3); })
        .attr('fill', function(d){ return color(d.id); })
        .attr('opacity', 1)
        .attr('cx', posPointX)
        .attr('cy', posPointY);

    points.exit().remove();

    d3.selectAll('._3d').sort(d3._3d().sort);

}

function posPointX(d){
    return d.projected.x;
}

function posPointY(d){
    return d.projected.y;
}

function init(mydata){
    var cnt = 0;
    xGrid = [], scatter = [], yLine = [];
    for(var z = -j; z < j; z++){
        for(var x = -j; x < j; x++){
            xGrid.push([x, 1, z]);
            //scatter.push({x: x, y: d3.randomUniform(0, -10)(), z: z, id: 'point_' + cnt++});
        }
    }
    // x -10 até 10
    // y 1 até -10
    // z -10 até 10
    xScalle = d3.scaleLinear().domain([-0.5,0.5]).range([-10, 10]);
    yScalle = d3.scaleLinear().domain([-1,1]).range([1, -10]);
    zScalle = d3.scaleLinear().domain([2,3]).range([-10, 10]);
    mydata.forEach((joint, index)=>{
        scatter.push(
            {x: xScalle(joint.x), y: yScalle(joint.y), z: zScalle(joint.z), id: 'point_' + cnt++}
        );
    });

    d3.range(-1, 11, 1).forEach(function(d){ yLine.push([-j, -d, -j]); });

    var data = [
        grid3d(xGrid),
        point3d(scatter),
        yScale3d([yLine])
    ];
    processData(data, 35);
}

function dragStart(){
    mx = d3.event.x;
    my = d3.event.y;
}

function dragged(){
    mouseX = mouseX || 0;
    mouseY = mouseY || 0;
    beta   = (d3.event.x - mx + mouseX) * Math.PI / 230 ;
    alpha  = (d3.event.y - my + mouseY) * Math.PI / 230  * (-1);
    var data = [
        grid3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(xGrid),
        point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(scatter),
        yScale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([yLine]),
    ];
    processData(data, 0);
}

function dragEnd(){
    mouseX = d3.event.x - mx + mouseX;
    mouseY = d3.event.y - my + mouseY;
}

let get_movement = ()=>localStorage.getItem("movement_id") ? localStorage.getItem("movement_id") : 'AimAndFireGun';
let get_actor = ()=>parseInt(d3.select('.actorSelect').node().value);
let get_json_files = (movement_name,actor_id)=>{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'json_frames/'+actor_id+'/'+movement_name+'/', false ); // false for synchronous request
    xmlHttp.send( null );
    let htmlPage=xmlHttp.responseText
    let file_names = []
    while(htmlPage.indexOf('<li><a href="')>0){
        //cutting html before
        htmlPage = htmlPage.substring(htmlPage.indexOf('<li><a href="')+13)
        let file_name = htmlPage.substring(0,htmlPage.indexOf(".json"))
        file_names.push(parseInt(file_name))
    }
    return file_names
}

let movementValue = '';
localStorage.setItem("movement_id", 'AimAndFireGun');
let actorValue = 0;
let gestureQueue = []
let clearInspector = false
let currentGesture = -1
let currentFrame = -1
let changeObserver = setInterval(()=>{
    let oldMovVal = movementValue;
    let oldActVal = actorValue;
    let hasChange = false
    let newMovVal = get_movement()
    if(newMovVal!==oldMovVal){
        oldMovVal = newMovVal
        hasChange = true
    }
    let newActVal = get_actor()
    if(newActVal!==oldActVal){
        oldActVal = newActVal
        hasChange = true
    }
    if(hasChange && oldMovVal !== '' && oldActVal !== 0){
        actorValue = oldActVal
        movementValue = oldMovVal
        console.log('change detected',movementValue,actorValue)
        let gestures_id = get_json_files(movementValue,actorValue)
        console.log(gestures_id)
        //compute change
        //get_json_files(newVal)
        //start('AimAndFireGun')
        gestureQueue = gestures_id
        clearInspector = true
    }
},500)

let skeletons = undefined
let jsonLoaded = false
let frameRunner = setInterval(()=>{
    if (clearInspector){
        clearInspector = false
        d3.select('.movementTotal').text(gestureQueue.length)
        d3.select('.movementId').text(0)
        currentGesture = 0
        currentFrame = 0
        jsonLoaded = false
    }else{
        if (currentGesture!==-1 && currentFrame!==-1){
            if(jsonLoaded){
                if (currentFrame < skeletons.length){
                    d3.selectAll('.frameId').text(currentFrame+1)
                    init(skeletons[currentFrame])
                    currentFrame++
                } else {
                    jsonLoaded = false
                    if (currentGesture < gestureQueue.length){
                        currentGesture = currentGesture + 1
                        currentFrame = 0
                    }
                }
            }else{
                if(currentGesture < gestureQueue.length){
                    let json_path = 'json_frames/'+actorValue+'/'+movementValue+'/'+gestureQueue[currentGesture]+'.json'
                    d3.select('.movementId').text(currentGesture+1)
                    d3.json(json_path, skns=>{
                        skeletons = skns; jsonLoaded = true;
                        d3.selectAll('.frameTotal').text(skeletons.length)
                        d3.selectAll('.frameId').text(0)
                    })
                }
            }
        }
    }

},40)
