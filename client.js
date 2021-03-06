window.onload = function()
{
    requirejs.config({
        paths: {
            'socket.io'             : './node_modules/socket.io/node_modules/socket.io-client/dist/socket.io',
            'node-uuid'             : './node_modules/node-uuid/uuid',
            'underscore'            : './node_modules/underscore/underscore',
            'Eventable'             : './engine/core/eventable',
            'moment'                : './lib/moment',
            'THREE'                 : './lib/three.js/build/three',
            'ShaderParticleGroup'   : './lib/ShaderParticleEngine/src/ShaderParticleGroup',
            'ShaderParticleEmitter' : './lib/ShaderParticleEngine/src/ShaderParticleEmitter',

            //'bson' : './node_modules/bson/browser_build/bson'

            'ThreeBaseRenderable'               : './engine/components/Render/ThreeBaseRenderable',
            'ThreeSeaBaseRenderable'            : './engine/components/Render/Sea3D/ThreeSeaBaseRenderable',
            'ThreeRenderableAviaryEntity'       : './game/ThreeRenderableAviaryEntity',
            'ThreeRenderableWorkerEntity'       : './game/ThreeRenderableWorkerEntity',
            'ThreeRenderableTreeEntity'         : './game/ThreeRenderableTreeEntity',
           /* 'ThreeRenderableBlacksmithEntity'   : './game/ThreeRenderableBlacksmithEntity',*/
            'ThreeRenderableCastleEntity'       : './game/ThreeRenderableCastleEntity',

            'SEA3D'         : './engine/components/Render/Sea3D/SEA3D',
            'SEA3DLoader'   : './engine/components/Render/Sea3D/SEA3DLoader',
            'SEA3DDeflate'  : './engine/components/Render/Sea3D/SEA3DDeflate',
            'SEA3DLZMA'     : './engine/components/Render/Sea3D/SEA3DLZMA'
        },
        shim: {
            'THREE': {
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/loaders/OBJMTLLoader' :{
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/loaders/OBJLoader' :{
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/loaders/MTLLoader' :{
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/Detector': {
                'exports': 'Detector'
            },
            'lib/three.js/examples/js/controls/OrbitControls': {
                deps: ['lib/three.js/build/three'],
                'exports': 'Detector'
            },
            'lib/three.js/examples/js/postprocessing/EffectComposer': {
                deps: ['lib/three.js/build/three', 'lib/three.js/examples/js/shaders/CopyShader', 'lib/three.js/examples/js/postprocessing/MaskPass'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/postprocessing/RenderPass': {
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/postprocessing/ShaderPass': {
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/postprocessing/MaskPass': {
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/shaders/CopyShader': {
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/shaders/VignetteShader': {
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/shaders/ColorCorrectionShader': {
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/shaders/SSAOShader': {
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/shaders/FXAAShader': {
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/shaders/VignetteShader': {
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/shaders/HorizontalTiltShiftShader': {
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'lib/three.js/examples/js/shaders/VerticalTiltShiftShader': {
                deps: ['lib/three.js/build/three'],
                'exports': 'THREE'
            },
            'ShaderParticleEmitter': {
                deps: ['lib/three.js/build/three'],
                'exports': 'ShaderParticleEmitter'
            },
            'ShaderParticleGroup': {
                deps: ['lib/three.js/build/three', 'ShaderParticleEmitter'],
                'exports': 'ShaderParticleGroup'
            },
            'Animation': {
                deps: ['lib/three.js/build/three'],
                'exports': 'Animation'
            },
            'SEA3D': {
                deps: ['THREE'],
                'exports': 'SEA3D'
            },
            'SEA3DLoader': {
                deps: ['THREE', 'SEA3D'],
                'exports': 'THREE'
            },
            'SEA3DDeflate': {
                deps: ['SEA3D'],
                'exports': 'SEA3D'
            },
            'SEA3DLZMA': {
                deps: ['SEA3D'],
                'exports': 'SEA3D'
            },

            'underscore': {
                'exports': '_'
            }
        }
    });

    requirejs([ 'engine/core/Class', 'engine/Core', 'engine/components/Network/NetworkClient',
                'engine/components/EntitySync/EntitySyncClient', 'engine/components/Render/ThreeIsometric',
                'engine/components/Render/command/RTSCommand',
                'engine/components/Render/ThreeLoader',
                'engine/core/Point',

                'THREE',
                './engine/components/Render/ThreeTileMap',
                './engine/components/Render/ThreeLayerMap',
                './game/AviaryEntity',
                './game/TreeEntity',
                /*'./game/BlacksmithEntity',*/
                './game/CastleEntity'


                ],
        function(Class, Core, NetworkClient, EntitySyncClient, ThreeIsometric, RTSCommand, ThreeLoader, Point, THREE, ThreeTileMap, ThreeLayerMap, AviaryEntity, TreeEntity, /*BlacksmithEntity,*/ CastleEntity) {

        var Client = Class.extend({
            _classId: 'Client',

            init: function () {
                this.log('start', 'log');

                engine.isServer = false;

                var self = this;
                engine.getRegisteredClassNewInstance('ThreeLoader')
                    .attach(engine, 'threeLoader')
                    .setOnProgressCallback(function(loaded, total, name){
                        if(loaded == total) {
                            console.log('All assets been loaded [' + total + '][' + name + ']');
                            self._init();
                        } else {
                            console.log('Loaded [' + loaded + '/' + total + '][' + name + '] assets');
                        }
                    })

                    .loadSea('worker', './game/assets/human/units/h_worker/worker.sea')
                    .loadSea('Player', './game/assets/test_soldier/player.sea')
                    .loadSea('h_aviary_main', './game/assets/human/buildings/h_aviary/h_aviary.sea')
                    .loadSea('h_castle', './game/assets/human/buildings/h_castle/h_castle.sea')
                    .loadSea('h_tree_001', './game/assets/other/tree/h_tree_001.sea?1')


                    .loadTexture('smoke_001', './game/assets/other/smoke_001.png')
                    .loadTexture('tilesetText', './game/assets/map/tilesets.jpg')


                    .loadTexture('tile_tile', './game/assets/terrain/texture/texture_tiles.jpg')
                    .loadTexture('dirt_tile', './game/assets/terrain/texture/texture_dirt.jpg')
                    .loadTexture('grass_tile', './game/assets/terrain/texture/texture_grass.jpg')
                    .loadTexture('grass_mask', './game/assets/terrain/mask/mask_grass.jpg')
                    .loadTexture('dirt_mask', './game/assets/terrain/mask/mask_dirt.jpg')
                    .loadTexture('tiles_mask', './game/assets/terrain/mask/mask_tiles.jpg')


            },

            _init: function() {

                //Render
                engine
                    .getRegisteredClassNewInstance('ThreeIsometric', {
                        debug: true,
                        shadow: true,
                        width: window.innerWidth,
                        height: window.innerHeight,
                        appendToElement: document.getElementById('renderer'),
                        camera: {
                            viewAngle: 27,
                            aspect: window.innerWidth / window.innerHeight,
                            near: 0.1,
                            far: 10000,
                            position: new Point(1000, 1000, 0),
                            lookAt:  new Point(0, 0, 0)
                        },
                        light: {
                            color:  0xffffff,
                            position: new Point(100, 60, 30)
                        }
                    })
                    .attach(engine, 'threeRenderer')
//                    .setPlane(1000, 1000, 'ground') //Add plane
                    .start(true);

                //Set resize event handler
                window.onresize = function() {
                    engine.threeRenderer.onResize(window.innerWidth,  window.innerHeight);
                }


                var layerMap = new ThreeLayerMap({
                    maskTexture: ['dirt_mask', 'tiles_mask', 'grass_mask'],
                    tilesTexture: ['dirt_tile', 'tile_tile', 'grass_tile'],
                    tilesSegments: 100,
                    width: 1000,
                    height: 1000
                });
                layerMap.mesh().scale.set(10, 10, 10);

                //Load TMX tile map
                /*var tileMap = new ThreeTileMap({
                    size: new THREE.Vector2(32, 32), //Size
                    tileSize: new THREE.Vector2(256, 256),//Tile size
                    layerData: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 8, 8, 8, 8, 8, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 1, 1, 1, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 4, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //layerData
                    tileset: 'tilesetText'
                }).attach(engine, 'tilemap');*/

                /*for(var i=0; i<(engine.tilemap._plane.vertices.length/2); i++) {
                    engine.tilemap._plane.vertices[i].z = i;
                }
                engine.tilemap.dataTex = engine.tilemap.packArray([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
                */

               /* var ts = engine
                    .getRegisteredClassNewInstance('WorkerEntity');
                ts.geometry(-500, 50, -256);
                ts.threeRenderable.playAnimation('walk'); //idlr, walk*/


                //geometry.faces[ i ].color.setHex( Math.random() * 0xffffff );
                //engine.getObjectsByGroup('army')['1b28f162-c391-4fe0-a41c-8683d871f8e3'].threeRenderable.mesh()



                //console.log(ts.threeRenderable.mesh().geometry);

                /*var ae = engine
                    .getRegisteredClassNewInstance('AviaryEntity');
                //ae.geometry(0, 32.5, 0);
                //ae.threeRenderable.playAnimation('idle');
                ae.threeRenderable.playAnimation('production');*/

                /*var ce = new CastleEntity();
                ce.geometry(0,0,0);*/
                //ce.geometry(256, 0, 256);

                /*var t1 = new TreeEntity();
                t1.geometry(-100, 0, -100);
                var t2 = new TreeEntity();
                t2.geometry(-100, 0, -200);
                var t3 = new TreeEntity();
                t3.geometry(-200, 0, -100);
                var t4 = new TreeEntity();
                t4.geometry(-150, 0, -150);
                var t5 = new TreeEntity();
                t5.geometry(-200, 0, -250);


                var color = 0x2AD140;
                var sqLength = 800;

                var squareShape = new THREE.Shape();
                squareShape.moveTo( 0,0 );
                squareShape.lineTo( 0, sqLength );
                squareShape.lineTo( sqLength, sqLength );
                squareShape.lineTo( sqLength, 0 );
                squareShape.lineTo( 0, 0 );

                //http://threejsdoc.appspot.com/doc/three.js/examples.source/webgl_geometry_shapes.html.html
                var squarePoints = squareShape.createPointsGeometry();
                var line = new THREE.Line( squarePoints, new THREE.LineBasicMaterial( { color: color, linewidth: 1 } ) );
                line.position.set(  -400, 200, 0 );
                line.rotation.x = -Math.PI / 2;
                engine.threeRenderer._scene.add( line );*/





                /*var object = new THREE.Mesh( new THREE.CircleGeometry( 100, 40, 0, Math.PI * 2 ), new THREE.LineBasicMaterial( {opacity: 1, blending: THREE.AdditiveBlending, transparent: true} ) );
                object.position.set( -500, 50, -256 );
                engine.threeRenderer._scene.add( object );*/

                /*var ae2 = new AviaryEntity();
                ae2.threeRenderable.playAnimation('produce');

                //Attach to de + down-scale
                ae2.attach(ae);
                ae2.threeRenderable.mesh().scale.set(128, 128, 128);
                ae2.threeRenderable.mesh().scale.set(1,1,1);

                //Attach back to engine
                ae2.geometry(128, 0, 128);
                ae2.attach(engine);*/

                //de.geometry(5,5,5);
                //de.geometry(1,1,1);
                //de.threeRenderable.mesh().position = new THREE.Vector3(0,0,2);
                //de.threeRenderable.mesh().lookAt(new THREE.Vector3(0,0,0));
                //de.threeRenderable.mesh().rotateY(30);



                //de.threeRenderable.mesh().translateX(-2);
                ///de.threeRenderable.mesh().rotation = new THREE.Vector3(0,20,20);
                //de.threeRenderable.mesh().rotation(THREE.Vector3(10,10,10));
                /*de.threeRenderable.mesh().translateX(100);
                de.threeRenderable.mesh().localToWorld(THREE.Vector3(10,10,10));*/
                //de.threeRenderable.mesh().updateMatrix(10);
                //de.threeRenderable.mesh().updateMatrixWorld(10);

                /*var xp = intersects[0].point.x.toFixed(2),
                yp = intersects[0].point.y.toFixed(2),
                zp = intersects[0].point.z.toFixed(2),
                destination = new THREE.Vector3( xp , yp , zp),

                radians =  Math.atan2( ( driller.position.x - xp) , (driller.position.z - zp));
                radians += 90 * (Math.PI / 180);

                var tween = new TWEEN.Tween(driller.rotation).to({ y : radians },200).easing(TWEEN.Easing.Linear.None).start();*/





                //RTS command
                var rtsc = new RTSCommand();

                //Networking
                engine
                 .getRegisteredClassNewInstance('NetworkClient', {pingPongTimeSyncInterval: 10000})
                 .attach(engine, 'network')
                 .connect('//localhost:4040');

                //Sync
                engine
                 .getRegisteredClassNewInstance('EntitySyncClient', {networkDriver: engine.network})
                 .processMinLatency(100) //Client only
                 .attach(engine, 'sync')
                 .start();


                //Ask server to createAviaryEntity
                engine.network.sendMessage('build', {entity: 'AviaryEntity', 'position': new Point(100,0,100), 'rotation': new Point(0,0,0)});
            }
        });

        new Core().start(
            new Client()
        );
    });
}