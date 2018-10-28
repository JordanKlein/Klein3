"use strict";

var gl;

var theta = 0.0;
var speed = 0.05;
var thetaLoc;

var direction = true;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = [
        vec2(  0,  1 ),
        vec2(  -1,  0 ),
        vec2( 1,  0 ),
        vec2(  0, -1 )
    ];

    var colors = [
        vec3(1.0, 0.0, 0.0),
        vec3(1.0, 0.0, 0.0),
        vec3(1.0, 0.0, 0.0),
        vec3(1.0, 0.0, 0.0)
    ];

    // Load the data into the GPU
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation( program, "theta" );

    // Initialize event handler (menu)
    document.getElementById("Controls" ).onclick = function(event) {
        switch( event.target.index ) {
          case 0:
            direction = !direction;
            break;
         case 1:
                colors = [
                    vec3(0.0, 0.0, 1.0),
                    vec3(0.0, 0.0, 1.0),
                    vec3(0.0, 0.0, 1.0),
                    vec3(0.0, 0.0, 1.0)
                ];

                var cBuffer = gl.createBuffer();
                gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
                gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

                var vColor = gl.getAttribLocation( program, "vColor" );
                gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
                gl.enableVertexAttribArray( vColor );

            break;
       }
    };
    document.getElementById("slider").onchange = function(event) {speed = parseFloat(event.target.value);}
    window.onkeydown =function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch(key){
            case 'D': //direction
            case 'd':
                direction = !direction;
                break;
            case 'F': //faster
            case 'f':
                speed += 0.1;
                break;
            case 'S': //slower
            case 's':
                speed -= 0.1;
                if (speed <= 0.0) {
                    speed =0.0;
                }
                break;
        }
    };
    document.getElementById("redbutton").onclick = function() {console.log("pressed button");
                colors = [
                    vec3(1.0, 0.0, 0.0),
                    vec3(1.0, 0.0, 0.0),
                    vec3(1.0, 0.0, 0.0),
                    vec3(1.0, 0.0, 0.0)
                ];

                var cBuffer = gl.createBuffer();
                gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
                gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

                var vColor = gl.getAttribLocation( program, "vColor" );
                gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
                gl.enableVertexAttribArray( vColor );
    }
    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    if (direction == true)
    {
        theta += speed;
    }
    else 
    {
        theta -= speed;
    }
    gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    window.requestAnimFrame(render);
}
