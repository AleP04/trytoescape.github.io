/*
MadeBy: 
 /$$$$$$$$ /$$                       /$$$$$$$$                                         /$$             /$$             
 |__  $$__/| $$                      | $$_____/                                        |__/            | $$             
    | $$   | $$$$$$$   /$$$$$$       | $$        /$$$$$$$  /$$$$$$$  /$$$$$$   /$$$$$$  /$$  /$$$$$$$ /$$$$$$   /$$$$$$$
    | $$   | $$__  $$ /$$__  $$      | $$$$$    /$$_____/ /$$_____/ |____  $$ /$$__  $$| $$ /$$_____/|_  $$_/  /$$_____/
    | $$   | $$  \ $$| $$$$$$$$      | $$__/   |  $$$$$$ | $$        /$$$$$$$| $$  \ $$| $$|  $$$$$$   | $$   |  $$$$$$ 
    | $$   | $$  | $$| $$_____/      | $$       \____  $$| $$       /$$__  $$| $$  | $$| $$ \____  $$  | $$ /$$\____  $$
    | $$   | $$  | $$|  $$$$$$$      | $$$$$$$$ /$$$$$$$/|  $$$$$$$|  $$$$$$$| $$$$$$$/| $$ /$$$$$$$/  |  $$$$//$$$$$$$/
    |__/   |__/  |__/ \_______/      |________/|_______/  \_______/ \_______/| $$____/ |__/|_______/    \___/ |_______/ 
                                                                             | $$                                       
                                                                             | $$                                       
                                                                             |__/     
AleP, Aurelio, Matteo, Saverio                                                                                                               
*/
'use strict';

let canvas, engine, scene, camera;

window.addEventListener('DOMContentLoaded', () => {
    window.addEventListener("resize", () => engine.resize());
    canvas = document.getElementById('c');
    canvas.addEventListener('wheel', evt => evt.preventDefault());

    // engine and scene
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    engine.runRenderLoop(() => scene.render());
    scene.gravity = new BABYLON.Vector3(0, -0.2, 0);
    scene.collisionsEnabled = true;
    scene.constantlyUpdateMeshUnderPointer = true;
    //scene.debugLayer.show();

    // camera
    camera = new BABYLON.UniversalCamera('cam',
        new BABYLON.Vector3(30, 20.4, 15),
        scene);
    camera.rotation.y = -Math.PI / 2;
    camera.fov = 1.2;
    camera.minZ = 0.45;
    camera.speed = 0.3;
    camera.applyGravity = true;
    camera.checkCollisions = true;
    camera.ellipsoid = new BABYLON.Vector3(1, 1.7, 1);
    camera._keys = [];
    camera.keysUp = [87];
    camera.keysDown = [83];
    camera.keysLeft = [65];
    camera.keysRight = [68];
    const footstepSound = new BABYLON.Sound("footstep", "./sounds/footstep.wav", scene)
    camera.onCollide = function (collidedMesh) {
        //console.log("ouck");
        if (!footstepSound.isPlaying) {
            footstepSound.play();
        }
    }

    // light
    const light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 50, 0));
    light.intensity = 0.6

    populateScene(scene);
});

//enter door, define globally to be able to set unlocked
let enterDoor;

function createFloor(y, isGround) {
    let hinge = new BABYLON.TransformNode('h', scene);
    let a = createWall(31, 8, 1, "./textures/wall.jpg");
    let c = createWall(31, 8, 1, "./textures/wall.jpg");
    let d = createWall(21, 8, 1, "./textures/wall.jpg");
    let floor = createFlooring(25, 1, 20, 2, 2, "./textures/flooring.jpg")
    let floorS = createFlooring(5, 1, 3, 0.3, 0.5, "./textures/flooring.jpg");
    let separatorWall = createWall(17, 7, 1, "./textures/wall.jpg");
    let floorStairs = createStairs(12, 5, 0.674, 4);
    let doorWall = createWall(3, 2, 1, "./textures/wall.jpg");
    let lamp1 = createLamp();
    let lamp2 = createLamp();

    a.position.set(0, 0, 0);
    c.position.set(1, 0, 21);
    d.position.set(32, 0, 0);
    d.rotation.y = -Math.PI / 2;
    floor.position.set(1, 0, 1)
    separatorWall.rotation.y = -Math.PI / 2;
    lamp1.rotation.y = Math.PI / 2;
    lamp1.position.set(4, 5, 21);
    lamp2.rotation.y = Math.PI / 2;
    lamp2.position.set(21, 5, 21);
    a.parent = hinge;
    c.parent = hinge;
    d.parent = hinge;
    floor.parent = hinge;
    if (!isGround) {
        let b = createWall(21, 8, 1, "./textures/wall.jpg");
        let separatorWall2 = createWall(17, 7, 1, "./textures/wall.jpg");
        let doorWall1 = createWall(3, 2, 1, "./textures/wall.jpg");
        const door1 = createDoor(Math.PI / 2, true);
        const door2 = createDoor(-Math.PI / 2, false);
        b.position.set(1, 0, 1)
        b.rotation.y = -Math.PI / 2;
        separatorWall.position.set(26, 1, 1);
        separatorWall2.rotation.y = -Math.PI / 2;
        separatorWall2.position.set(7, 1, 1);
        floorS.position.set(26, 0, 18);
        floorStairs.rotation.y = Math.PI;
        floorStairs.position.set(3.5, 1.25, 18);
        floorStairs.parent = hinge;
        doorWall.position.set(7, 6, 18);
        doorWall.rotation.y = -Math.PI / 2;
        doorWall1.position.set(26, 6, 18);
        doorWall1.rotation.y = -Math.PI / 2;
        door1.position.set(25, 1, 21);
        door2.position.set(7, 1, 21);
        b.parent = hinge;
        separatorWall2.parent = hinge;
        doorWall.parent = hinge;
        doorWall1.parent = hinge;
        door1.parent = hinge;
        door2.parent = hinge;
        hinge.position.y = y;
    }
    else {
        let b1 = createWall(21, 1, 1, "./textures/wall.jpg");
        let b2 = createWall(21, 2, 1, "./textures/wall.jpg");
        let b3 = createWall(20 / 2 - 2, 5, 1, "./textures/wall.jpg");
        let b4 = createWall(20 / 2, 5, 1, "./textures/wall.jpg");
        enterDoor = createDoor(-Math.PI / 2, false, true);
        const door = createDoor(Math.PI / 2, true);

        b1.rotation.y = -Math.PI / 2;
        b1.position.set(1, 0, 1);
        b2.rotation.y = -Math.PI / 2;
        b2.position.set(1, 6, 1);
        b3.rotation.y = -Math.PI / 2;
        b3.position.set(1, 1, 1);
        b4.rotation.y = -Math.PI / 2;
        b4.position.set(1, 1, 12);
        floorS.position.set(26, 0, 1)
        floorStairs.position.set(28.5, 1.25, 4);
        let s = createStairs(2, 3, 0.5, 3);
        s.rotation.y = Math.PI / 2;
        s.position.z = 21 / 2;
        s.position.x = -s.stairDepth * 2;
        separatorWall.position.set(26, 1, 4)
        doorWall.position.set(26, 6, 1);
        doorWall.rotation.y = -Math.PI / 2;
        enterDoor.position.set(0.2, 1, 12);
        door.position.set(25, 1, 4);

        hinge.position.y = y;
        b1.parent = hinge
        b2.parent = hinge
        b3.parent = hinge
        b4.parent = hinge
        floorStairs.parent = hinge;
        s.parent = hinge;
        doorWall.parent = hinge;
        enterDoor.parent = hinge;
        door.parent = hinge;
    }
    lamp1.parent = hinge;
    lamp2.parent = hinge;
    separatorWall.parent = hinge;
    floorS.parent = hinge;

    return hinge;
}

function populateScene() {

    initGUI(scene, camera);
    createSkybox(scene);
    createGround(scene);
    createLimits(scene);

    // #region tree generation
    const treeNumber = 500;
    createTrees(treeNumber, -100, -25, -25, 100);
    createTrees(treeNumber, -25, 50, 100, 100);
    createTrees(treeNumber, -100, -25, 50, -100);
    createTrees(treeNumber, 40, -100, 100, 50);
    // #endregion

    // #region house generation with generic algorithm
    let floorNumber = 2;
    let f0 = createFloor(0, true);
    let floors = [f0]
    for (let i = 1; i < floorNumber; i++) {
        floors[i] = createFloor(8 * i, false);
        if (i % 2 == 0) {
            floors[i].rotation.y = Math.PI;
            floors[i].position.set(32, i * 8, 22);
        }
    }
    let roof = createRoof();
    roof.position.y = floorNumber * 8;

    if (floorNumber % 2 != 0) {
        roof.rotation.y = Math.PI;
        roof.position.x = 32;
        roof.position.z = 22;
    }
    // #endregion
    createBed(28.75, 17, 19.75, Math.PI / 2);
    //createCradle(24, 19.02, 1.1);
    createCardboard(14, 17.75, 8, 0);
    createCardboard(13.6, 17.75, 6, Math.PI / -1.5);
    createCardboard(14, 19.25, 7, Math.PI / -1.25);
    createCardboard(17, 17.75, 17.2, Math.PI / 1.75);
    createCardboard(17, 19.25, 17.2, Math.PI / -1.3);
    createCardboard(18, 17.75, 11, Math.PI / -1.3);

    const railing1 = createRailing(scene);
    railing1.rotation.y = Math.PI / 2;
    railing1.position.set(6, 17, 5.1);

    const railing2 = createRailing(scene);
    railing2.rotation.y = Math.PI / 2;
    railing2.position.set(6, 17, 8.9);

    const railing3 = createRailing(scene);
    railing3.rotation.y = Math.PI / 2;
    railing3.position.set(6, 17, 12.7);

    const railing4 = createRailing(scene);
    railing4.rotation.y = Math.PI / 2;
    railing4.position.set(6, 17, 16.5);

    const railing5 = createRailing(scene);
    railing5.rotation.y = Math.PI / 2;
    railing5.scaling.set(0.7, 1, 1);
    railing5.position.set(6, 17, 19.75);

    // #region furnish spawn room // #endregion

    // #region furnish hint room
    showHintRoomGUI();

    const picture1 = createPicture(scene, "./textures/fibonacci.jpg")
    picture1.rotation.y = Math.PI;
    picture1.position.set(24.9, 9, 17);

    const picture2 = createPicture(scene, "./textures/vitruvian.jpg")
    picture2.rotation.y = Math.PI * 2;
    picture2.position.set(7.2, 9, 12);

    const shelf1 = createBookshelf(scene);
    const shelf2 = createBookshelf(scene);
    shelf1.rotation.y = -Math.PI / 2;
    shelf1.position.set(6.5, 9, 8);
    shelf2.rotation.y = Math.PI / 2;
    shelf2.position.set(25.5, 9.04, 10);

    const board = createBoard(scene);
    board.rotation.y = Math.PI / 2 + Math.PI / 4;
    board.position.set(22, 10, 4)

    const desk = createDesk(scene)
    desk.position.set(14, 9, 2);
    desk.rotation.y = Math.PI;
    // #endregion

    // #region polyhedron creation
    for (let i = 0; i < 6; i++) {
        let t = i / (6 - 1);
        let phi = Math.PI * 2 * t;
        createStand(1.6 * Math.cos(phi) + 16, 9, 1.6 * Math.sin(phi) + 13, -phi + Math.PI / 2);
    }

    let cube = new BABYLON.MeshBuilder.CreateBox('w', { width: 0.6, height: 0.6, depth: 0.6 }, scene);
    cube.position.set(1.6 * Math.cos(Math.PI * 2 * 5 / (6 - 1)) + 16, 12.2, 1.6 * Math.sin(Math.PI * 5 * 2 / (6 - 1)) + 13);

    const shapes = [cube];
    for (let i = 1; i < 5; i++) {
        let t = i / (6 - 1);
        let phi = Math.PI * 2 * t;
        shapes[i] = BABYLON.Mesh.CreatePolyhedron("shape" + i, { type: i - 1, size: 0.4 }, scene);
        shapes[i].position.set(1.6 * Math.cos(phi) + 16, 12.2, 1.6 * Math.sin(phi) + 13);
    }

    const Mat0 = new BABYLON.StandardMaterial('p', scene);
    cube.material = Mat0;
    const Mat1 = new BABYLON.StandardMaterial('p', scene);
    shapes[1].material = Mat1;
    const Mat2 = new BABYLON.StandardMaterial('p', scene);
    shapes[2].material = Mat2;
    const Mat3 = new BABYLON.StandardMaterial('p', scene);
    shapes[3].material = Mat3;
    const Mat4 = new BABYLON.StandardMaterial('p', scene);
    shapes[4].material = Mat4;
    // #endregion

    // #region furnish puzzle room

    //array of Containers for shelf
    const shelfCubes = [];

    //array of Containers for ground
    const groundCubes = [];

    //array containing all cubes
    let numberCubes = [];

    //filled to indicated the number of cubes in the arrays of Containers
    groundCubes.filled = 10;
    shelfCubes.filled = 0;

    //shelves
    for (let i = 0; i < 5; i++) {
        let s = createWallShelf();
        s.position.set(19.5 - i * 3.2, 3.4, 20.4);
        s.rotation.y = -Math.PI / 2;
    }

    //cube material
    const nCubeMat = new BABYLON.StandardMaterial("nCubeMat0", scene);
    nCubeMat.diffuseTexture = new BABYLON.Texture("./textures/0.jpg", scene);

    //create the first cube, put it in a container, put the container in the array of grounded containers
    //and in the array of cubes
    let nCube = new BABYLON.MeshBuilder.CreateBox('numberCube', { size: 0.8 }, scene);
    nCube.position.set(6.5, 1.4, 19.4);
    nCube.number = 0;
    nCube.material = nCubeMat;
    groundCubes.push(new Container(nCube, nCube.position));
    numberCubes = [nCube];

    //fill the array of grounded cubes
    for (let i = 1; i <= 9; i++) {
        let nc = new BABYLON.MeshBuilder.CreateBox('numberCube' + i, { size: 0.8 }, scene);
        let nCubeMat = new BABYLON.StandardMaterial("nCubeMat" + i, scene);
        nCubeMat.diffuseTexture = new BABYLON.Texture("./textures/" + i + ".jpg", scene);
        nc.position.set(6.5 + i * 1.4, 1.4, 19.4);
        nc.number = i;
        nc.material = nCubeMat
        groundCubes.push(new Container(nc, nc.position));
        numberCubes.push(nc);
    }

    //filling the array of shelf containers with positions only
    shelfCubes[0] = new Container(null, new BABYLON.Vector3(6.7, 4, 20.4), true);

    for (let i = 1; i < 5; i++) {
        shelfCubes[i] = new Container(null, new BABYLON.Vector3(6.7 + i * 3.2, 4, 20.4), true);
    }

    const cubeClickSound = new BABYLON.Sound("clickCube", "./sounds/click_cube.wav", scene);
    const cubeWrongSound = new BABYLON.Sound("wrongCube", "./sounds/cube_wrong.wav", scene);
    const cubeSuccessSound = new BABYLON.Sound("successCube", "./sounds/cube_success.wav", scene);

    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN &&
            pointerInfo.pickInfo.hit &&
            pointerInfo.pickInfo.pickedMesh.name.startsWith('numberCube')) {
            cubeClickSound.play();

            switchCube(pointerInfo.pickInfo.pickedMesh)

        }
    });

    function switchCube(cube) {
        let groundContainer, shelfContainer;
        if (cube.position.y < 1.41) {
            //check in which container the cube is contained
            for (let i = 0; i < 10; i++) {
                if (groundCubes[i].content === cube) {
                    groundContainer = groundCubes[i];
                    break;
                }
            }
            //find the first free container in shelf
            for (let i = 0; i < 5; i++) {
                if (shelfCubes[i].content == null) {
                    shelfContainer = shelfCubes[i];
                    break;
                }
            }
            //if the cube is at ground move up with animation
            BABYLON.Animation.CreateAndStartAnimation("up", cube, "position", 100, 100,
                cube.position, shelfContainer.position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            shelfContainer.content = cube;
            shelfCubes.filled++;
            groundContainer.content = null;
            groundCubes.filled--;
        }
        else {
            //check in which container the cube is contained
            for (let i = 0; i < 5; i++) {
                if (shelfCubes[i].content === cube) {
                    shelfContainer = shelfCubes[i];
                    break;
                }
            }
            console.log(shelfContainer.content.name)

            //find the first free container in ground
            for (let i = 0; i < 10; i++) {
                if (groundCubes[i].content == null) {
                    groundContainer = groundCubes[i];
                    break;
                }
            }
            //if the cube is on the shelf move down
            BABYLON.Animation.CreateAndStartAnimation("up", cube, "position", 100, 100,
                cube.position, groundContainer.position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            groundContainer.content = cube;
            groundCubes.filled++
            shelfContainer.content = null;
            shelfCubes.filled--;
        }

    };

    function checkCubeDisposition() {
        let previous = 0;
        let current = 1;
        let result = 0;
        //fibonacci
        for (let i = 0; i < 5; i++) {
            result = previous + current;
            if (shelfCubes[i].content.number != result) {
                return false;
            }
            previous = current
            current = result;
        }
        return true;
    }

    const quiz = function () {
        showCheckButton(function () {
            if (shelfCubes.filled == 5) {
                if (!checkCubeDisposition()) {
                    for (let i = 0; i < 5; i++) {
                        switchCube(shelfCubes[i].content);
                        cubeWrongSound.play();
                    }
                }
                else {
                    enterDoor.isLocked = false;
                    cubeSuccessSound.play();
                    camera.won = true;
                    return true;
                }
            }
            else {
                cubeWrongSound.play();
            }
            return false;
        })

    };

    showPuzzleScreen(quiz);

    showWinGUI();
    // #endregion

    scene.registerBeforeRender(() => {
        let t = performance.now() * 0.001;

        // #region mesh highlighting
        let mesh = scene.meshUnderPointer;
        for (let i = 0; i < 10; i++) {
            let c = numberCubes[i];
            if (mesh == c)
                c.material.emissiveColor.set(0.1, 0.1, 0.1)
            else {
                c.material.emissiveColor.set(0, 0, 0)
            }
        }
        // #endregion

        // #region polyhedron animation
        shapes[0].rotation.y = t;
        shapes[1].rotation.y = t;
        shapes[2].rotation.y = t;
        shapes[3].rotation.y = t;
        shapes[4].rotation.y = t;
        shapes[0].position.y = Math.sin(t + 1.2) / 3 + 12.2;
        shapes[1].position.y = Math.sin(t + 2.5) / 3 + 12.2;
        shapes[2].position.y = Math.sin(t + 3.7) / 3 + 12.2;
        shapes[3].position.y = Math.sin(t + 5) / 3 + 12.2;
        shapes[4].position.y = Math.sin(t) / 3 + 12.2;
        Mat0.diffuseColor = new BABYLON.Color3(0.19 + Math.abs(Math.sin(t)) * 0.24, 0.09 + Math.abs(Math.sin(t)) * 0.12, 0.09 + Math.abs(Math.sin(t)) * 0.12);
        Mat1.diffuseColor = new BABYLON.Color3(1, Math.abs(Math.sin(t)) * 0.47, 0);
        Mat2.diffuseColor = new BABYLON.Color3(Math.abs(Math.sin(t)) * 0.59, 0.66 + Math.abs(Math.sin(t)) * 0.32, 0.7 + Math.abs(Math.sin(t)) * 0.3);
        Mat3.diffuseColor = new BABYLON.Color3(0.28 + Math.abs(Math.sin(t)) * 0.41, 0, 0.34 + Math.abs(Math.sin(t)) * 0.5);
        Mat4.diffuseColor = new BABYLON.Color3(0, 0.06 + Math.abs(Math.sin(t)) * 0.14, 0.31 + Math.abs(Math.sin(t)) * 0.67);
        // #endregion
    });
}
