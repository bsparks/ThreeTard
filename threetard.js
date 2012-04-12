/* threetard.js - js game engine for dummies */

var ThreeTard = {};

(function(TT) {
    var scene, camera, 
        then = Date.now(),
        frameMethod = function() {},
        started = false,
        keysDown = {};
    
    scene = new THREE.Scene();
    TT.scene = scene; // remove?
    
    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    
    // add directional light source
    //var directionalLight = new THREE.DirectionalLight(0xffffff);
    //directionalLight.position.set(1, 1, 1).normalize();
    
    TT.lights = [];
    TT.lights[0] = ambientLight;
    
    var SCREEN_WIDTH = 800;
    var SCREEN_HEIGHT = 600;
    var FOV_ANGLE = 90;
    var NEAR_Z = 1;
    var FAR_Z = 10000;
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.setClearColorHex(0x00);
    TT.renderer = renderer; // remove?
    
    // always have default camera
    camera = new THREE.PerspectiveCamera( FOV_ANGLE, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR_Z, FAR_Z );
    camera.position.z = 500;
    camera.speed = 200;
    scene.add(camera);
    TT.cameras = [];
    TT.cameras[0] = camera;
    
    // object db
    var objects = {};
    
    // hook function array
    var hooks = [];
    
    var frame = function() {
        var now = Date.now();
        var delta = now - then;
        
        var frameState = {
            elapsed: delta / 1000,
            keys: keysDown
        };
        
        for(i=0;i<hooks.length;i++) {
            hooks[i].call(null, frameState);
        }

        frameMethod.call(null, frameState);
        
        renderer.render(scene, camera);

        then = now;

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( frame );
    };
    
    // start the game loop, can only happen once
    TT.start = function(method) {
        if(!started) {
            
            //todo: doc ready test
            document.body.appendChild( renderer.domElement );
            
            // simple input hook
            document.addEventListener("keydown", function (e) {
                //console.log("keydown", e, keysDown);
                keysDown[e.keyCode] = true;
            }, false);

            document.addEventListener("keyup", function (e) {
                //delete keysDown[e.keyCode];
                keysDown[e.keyCode] = false;
            }, false);
            
            if(method) {
                frameMethod = method;
            }
            
            frame();
            started = true;
        }
    };
    
    TT.makeCube = function(id, size) {
        var geometry = new THREE.CubeGeometry( size, size, size );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
        scene.add( mesh );
        
        // todo: handle overwrites
        objects[id] = mesh;
    };
    
    TT.makeSphere = function(id, radius) {
        var geometry = new THREE.SphereGeometry( radius );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
        scene.add( mesh );
        
        // todo: handle overwrites
        objects[id] = mesh;
    };
    
    TT.makePlane = function(id, width, height, segWidth, segHeight) {
        var geometry = new THREE.PlaneGeometry( width, height, segWidth, segHeight );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
        scene.add( mesh );
        
        // todo: handle overwrites
        objects[id] = mesh;
    };
    
    TT.positionObject = function(id, x, y, z) {
        objects[id].position.x = x;
        objects[id].position.y = y;
        objects[id].position.z = z;
    };
    
    TT.rotateObject = function(id, x, y, z) {
        objects[id].rotation.x = x;
        objects[id].rotation.y = y;
        objects[id].rotation.z = z;
    };
    
    TT.xRotateObject = function(id, amount) {
        objects[id].rotation.x = amount;
    };
    
    TT.yRotateObject = function(id, amount) {
        objects[id].rotation.y = amount;
    };
    
    TT.zRotateObject = function(id, amount) {
        objects[id].rotation.z = amount;
    };
    
    TT.controlCameraUsingArrowKeys = function(id) {
        id = id || 0;
        var camera = TT.cameras[id];
        
        hooks.push(function(state) {
            if (state.keys[38] === true) { // Player holding up
                //console.log("UP");
                camera.position.z -= camera.speed * state.elapsed;
            }
            if (state.keys[40] === true) { // Player holding down
                camera.position.z += camera.speed * state.elapsed;
            }
            if (state.keys[37] === true) { // Player holding left
                camera.position.x -= camera.speed * state.elapsed;
            }
            if (state.keys[39] === true) { // Player holding right
                camera.position.x += camera.speed * state.elapsed;
            }
        });
    };

}(ThreeTard));