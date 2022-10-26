'use strict'

function createWall(x, y, z, texture) {
    let hinge = new BABYLON.TransformNode('h', scene);
    let wall = new BABYLON.MeshBuilder.CreateBox('w', { width: x, height: y, depth: z }, scene);
    wall.checkCollisions = true;
    const wallMat = new BABYLON.StandardMaterial("wallMat");
    wallMat.diffuseTexture = new BABYLON.Texture(texture, scene);
    wallMat.diffuseTexture.uScale = x / 4;
    wallMat.diffuseTexture.vScale = y / 4;
    wallMat.bumpTexture = new BABYLON.Texture("./textures/wall_bump.jpg", scene);
    wallMat.bumpTexture.vScale = y / 4;
    wallMat.bumpTexture.uScale = x / 4;
    wall.material = wallMat;
    wall.position.set(x / 2, y / 2, z / 2);
    wall.parent = hinge;
    return hinge;
}

function createFlooring(x, y, z, uScale, vScale, texture) {
    let hinge = new BABYLON.TransformNode('h', scene);
    let floor = new BABYLON.MeshBuilder.CreateBox('w', { width: x, height: y, depth: z }, scene);
    floor.checkCollisions = true;
    const floorMat = new BABYLON.StandardMaterial("fM");
    floorMat.diffuseTexture = new BABYLON.Texture(texture, scene);
    floorMat.diffuseTexture.uScale = uScale;
    floorMat.diffuseTexture.vScale = vScale;
    floorMat.bumpTexture = new BABYLON.Texture("./textures/floor_bump.jpg", scene);
    floorMat.bumpTexture.vScale = vScale;
    floorMat.bumpTexture.uScale = uScale;
    floor.material = floorMat;
    floor.position.set(x / 2, y / 2, z / 2);
    floor.parent = hinge;
    return hinge;
}

function createStairs(stairNumber, stairWidth, stairHeight, widthDepthRatio) {
    let stairDepth = stairWidth / widthDepthRatio
    let first = new BABYLON.MeshBuilder.CreateBox('o', { width: stairWidth, height: stairHeight, depth: stairDepth }, scene);
    first.checkCollisions = true;
    first.position.set(0, 0, stairDepth / 2);
    let stairs = new BABYLON.TransformNode('box', scene);
    let hDepth = stairDepth / 2;
    let groundHeight = Math.sqrt(stairHeight * stairHeight + hDepth * hDepth);
    const groundHinge = new BABYLON.TransformNode('ground', scene);
    groundHinge.position.y = stairHeight / 2;
    const firstGround = BABYLON.MeshBuilder.CreateGround("ground",
        {
            height: groundHeight,
            width: stairWidth
        });
    firstGround.position.set(0, 0, -groundHeight / 2);
    const mat = new BABYLON.StandardMaterial("stairsMat", scene);
    mat.diffuseTexture = new BABYLON.Texture("./textures/stairs.jpg", scene);
    mat.diffuseTexture.uAngle = 100;
    mat.diffuseTexture.vAngle = 90;
    mat.bumpTexture = new BABYLON.Texture("./textures/stairs_bump.jpg");
    mat.bumpTexture.uAngle = 100;
    mat.bumpTexture.vAngle = 90;
    first.material = mat;
    firstGround.checkCollisions = true;
    firstGround.isVisible = false;
    firstGround.parent = groundHinge;
    groundHinge.rotation.x = -Math.asin(stairHeight);
    groundHinge.parent = stairs;

    first.parent = stairs;
    for (let i = 1; i < stairNumber; i++) {
        let b = first.createInstance('b' + i, scene);
        b.position.set(0, stairHeight * i, stairDepth * i + first.position.z);
        b.checkCollisions = true;
        b.parent = stairs;
        const gH = new BABYLON.TransformNode('ground', scene);
        let g = BABYLON.MeshBuilder.CreateGround("ground",
            {
                height: groundHeight,
                width: stairWidth
            });
        //g.position.set(0, stairHeight * i, (-ipotenusa / 4 + stairDepth) * i + ipotenusa / 4 * i - ipotenusa / 4);
        g.position.set(0, 0, -groundHeight / 2)
        g.checkCollisions = true;
        g.isVisible = false;
        g.parent = gH;
        gH.position.set(0, stairHeight * i + stairHeight / 2, i * stairDepth);
        gH.rotation.x = -Math.asin(stairHeight);
        gH.parent = stairs;
        //remember to set parent, set invisible and clean code
    }
    const stairsHinge = new BABYLON.TransformNode('stairsH', scene);
    stairs.parent = stairsHinge
    stairsHinge;
    stairsHinge.stairDepth = stairDepth;
    stairsHinge.position.y = stairHeight / 2;
    stairsHinge.stairDepth = stairDepth;
    return stairsHinge;
}

function createDoor(openRotation, leftHinge, isLocked = false) {
    const hinge = new BABYLON.TransformNode(scene);
    hinge.isLocked = isLocked;
    BABYLON.SceneLoader.ImportMesh("", "", "./assets/door.babylon", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        let knob = newMeshes[0];
        let door = newMeshes[1];
        const doorMat = new BABYLON.StandardMaterial("dM");
        doorMat.diffuseTexture = new BABYLON.Texture("./textures/stairs.jpg");
        doorMat.bumpTexture = new BABYLON.Texture("./textures/stairs_bump.jpg")
        const knobMat = new BABYLON.StandardMaterial("kM");
        knobMat.diffuseTexture = new BABYLON.Texture("./textures/gold.jpg")
        door.material = doorMat;
        knob.material = knobMat;
        if (leftHinge) {
            door.position.x = 0.1;
            knob.position.x = 0.1;
        } else {
            door.position.x = -0.1
            knob.position.x = -0.1;
        }
        door.position.z = -2.03;
        knob.position.y = 3.3;
        knob.position.z = -3.5;
        door.checkCollisions = true;
        door.isPickable = true;
        knob.parent = hinge;
        door.parent = hinge;

        hinge.scaling.y = 0.64;
        hinge.scaling.z = 0.74;

        const frameRate = 60;
        const open = new BABYLON.Animation("open", "rotation.y",
            frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        const openKeyFrames = [];

        openKeyFrames.push({
            frame: 0,
            value: 0
        });
        openKeyFrames.push({
            frame: frameRate / 2,
            value: openRotation - openRotation / 3
        });
        openKeyFrames.push({
            frame: frameRate,
            value: openRotation
        });

        const closeKeyFrames = [];

        closeKeyFrames.push({
            frame: 0,
            value: openRotation
        });
        closeKeyFrames.push({
            frame: frameRate / 2,
            value: openRotation / 3
        });
        closeKeyFrames.push({
            frame: frameRate,
            value: 0
        });

        const openDoorSound = new BABYLON.Sound("openDoor", "./sounds/open_door.wav", scene);
        const closeDoorSound = new BABYLON.Sound("closeDoor", "./sounds/close_door.wav", scene);
        const lockedDoorSound = new BABYLON.Sound("lockedDoor", "./sounds/locked_door.wav", scene);




        scene.onPointerObservable.add(pointerInfo => {
            if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN
                && (hinge.rotation.y == 0 || hinge.rotation.y == openRotation)) {
                const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
                let mesh = pickInfo.pickedMesh;
                if (mesh === door) {
                    if (!hinge.isLocked) {
                        if (hinge.rotation.y == 0) {
                            open.setKeys(openKeyFrames);
                            openDoorSound.play();
                        }
                        else if (hinge.rotation.y == openRotation) {
                            open.setKeys(closeKeyFrames);
                            closeDoorSound.play()
                        }
                        hinge.animations.push(open);
                        scene.beginAnimation(hinge, 0, frameRate, true);
                    }
                    else {
                        lockedDoorSound.play();
                    }
                }
            }
        });
    });

    return hinge;
}

function createRoof() {
    const hinge = new BABYLON.TransformNode('h', scene);
    const A = createWall(31, 4, 1, "./textures/wall.jpg");
    const A1 = createWall(30, 1, 0.1, "./textures/wall.jpg");
    const B = createWall(21, 4, 1, "./textures/wall.jpg");
    const C = createWall(31, 4, 1, "./textures/wall.jpg");
    const C1 = createWall(30, 1, 0.1, "./textures/wall.jpg");
    const D = createWall(21, 4, 1, "./textures/wall.jpg");
    const floorS = createWall(5, 3, 1, "./textures/wall.jpg");
    const floor = createWall(25, 20, 1, "./textures/wall.jpg");
    floorS.rotation.x = Math.PI / 2;
    floorS.position.set(1, 1, 1)
    floor.rotation.x = Math.PI / 2;
    floor.position.set(6, 1, 1)
    C.position.set(1, 0, 21);
    A1.position.set(1, 4, 0.9);
    C1.position.set(1, 4, 21);
    B.rotation.y = Math.PI / 2;
    B.position.set(0, 0, 22);
    D.rotation.y = Math.PI / 2;
    D.position.set(31, 0, 21);

    const wallFront = BABYLON.MeshBuilder.CreateCylinder("roof", { diameter: 25.41, height: 1, tessellation: 3 });
    //                                                             height/2,diameter/5.33049,diameter/2.3084
    const wallBack = BABYLON.MeshBuilder.CreateCylinder("roof", { diameter: 25.41, height: 1, tessellation: 3 });
    //                                                             height/2,diameter/5.33049,diameter/2.3084
    const frontBackMat = new BABYLON.StandardMaterial('fbm');
    frontBackMat.diffuseTexture = new BABYLON.Texture("./textures/wall.jpg");
    frontBackMat.diffuseTexture.wAng = Math.PI / 2;
    frontBackMat.diffuseTexture.uScale = 2.21;
    frontBackMat.diffuseTexture.vScale = 8.84;
    frontBackMat.bumpTexture = new BABYLON.Texture("./textures/wall_bump.jpg");
    frontBackMat.bumpTexture.wAng = Math.PI / 2;
    frontBackMat.bumpTexture.uScale = 2.21;
    frontBackMat.bumpTexture.vScale = 8.84;

    wallFront.material = frontBackMat;
    wallFront.checkCollisions = true;
    wallFront.scaling.x = 0.3;
    wallFront.rotation.z = Math.PI / 2;
    wallFront.position.set(1 / 2, 25.41 / 5.33049 - 2.86 + 4, 25.41 / 2.3084);
    wallBack.material = frontBackMat;
    wallBack.checkCollisions = true;
    wallBack.scaling.x = 0.3;
    wallBack.rotation.z = Math.PI / 2;
    wallBack.position.set(1 / 2 + 31, 25.41 / 5.33049 - 2.86 + 4, 25.41 / 2.3084);

    const roofMat = new BABYLON.StandardMaterial('roofMat');
    roofMat.diffuseTexture = new BABYLON.Texture("./textures/roof.jpg");
    roofMat.diffuseTexture.uScale = 7.54;
    roofMat.diffuseTexture.vScale = 0.64;

    const sRoofMat = new BABYLON.StandardMaterial('roofMat');
    sRoofMat.diffuseTexture = new BABYLON.Texture("./textures/roof.jpg");
    sRoofMat.diffuseTexture.uScale = 1.87;
    sRoofMat.diffuseTexture.vScale = 0.75;


    const dxHw1 = new BABYLON.TransformNode('rd', scene);
    const dxw1 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 4, height: 5, depth: 1 });
    dxw1.position.set(16, 13.53 / 2, 0.5);
    dxw1.checkCollisions = true;
    dxw1.material = new BABYLON.StandardMaterial('c', scene);
    dxw1.material.alpha = 0.7;
    dxw1.parent = dxHw1;
    dxHw1.position.set(17.5 + 8.5, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 / 2);
    dxHw1.rotation.y = Math.PI;
    dxHw1.rotation.x = Math.PI / 2;

    const dxHw2 = new BABYLON.TransformNode('rd', scene);
    const dxw2 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 4, height: 5, depth: 1 });
    dxw2.position.set(16, 13.53 / 2, 0.5);
    dxw2.checkCollisions = true;
    dxw2.material = new BABYLON.StandardMaterial('c', scene);
    dxw2.material.alpha = 0.7;
    dxw2.parent = dxHw2;
    dxHw2.position.set(17.5 + 20.5, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 / 2);
    dxHw2.rotation.y = Math.PI;
    dxHw2.rotation.x = Math.PI / 2;

    const dxH1 = new BABYLON.TransformNode('rd', scene);
    const dx1 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 32, height: 13.53 - 9, depth: 1 });
    dx1.position.set(16, 13.53 / 2, 0.5);
    dx1.checkCollisions = true;
    dx1.material = roofMat;
    dx1.parent = dxH1;
    dxH1.position.set(32, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) / 2);
    dxH1.rotation.y = Math.PI;
    dxH1.rotation.x = Math.PI / 2;

    const dxH2 = new BABYLON.TransformNode('rd', scene);
    const dx2 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 32, height: 4, depth: 1 });
    dx2.position.set(16, 13.53 / 2, 0.5);
    dx2.checkCollisions = true;
    dx2.material = roofMat;
    dx2.parent = dxH2;
    dxH2.position.set(32, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 - 4 / 2);
    dxH2.rotation.y = Math.PI;
    dxH2.rotation.x = Math.PI / 2;

    const dxH3 = new BABYLON.TransformNode('rd', scene);
    const dx3 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 8, height: 5, depth: 1 });
    dx3.position.set(16, 13.53 / 2, 0.5);
    dx3.checkCollisions = true;
    dx3.material = sRoofMat;
    dx3.parent = dxH3;
    dxH3.position.set(20, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 / 2);
    dxH3.rotation.y = Math.PI;
    dxH3.rotation.x = Math.PI / 2;

    const dxH4 = new BABYLON.TransformNode('rd', scene);
    const dx4 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 8, height: 5, depth: 1 });
    dx4.position.set(16, 13.53 / 2, 0.5);
    dx4.checkCollisions = true;
    dx4.material = sRoofMat;
    dx4.parent = dxH4;
    dxH4.position.set(32, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 / 2);
    dxH4.rotation.y = Math.PI;
    dxH4.rotation.x = Math.PI / 2;

    const dxH5 = new BABYLON.TransformNode('rd', scene);
    const dx5 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 8, height: 5, depth: 1 });
    dx5.position.set(20, 13.53 / 2, 0.5);
    dx5.checkCollisions = true;
    dx5.material = sRoofMat;
    dx5.parent = dxH5;
    dxH5.position.set(48, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 / 2);
    dxH5.rotation.y = Math.PI;
    dxH5.rotation.x = Math.PI / 2;

    const meshd = BABYLON.Mesh.MergeMeshes([dxw1, dxw2, dx1, dx2, dx3, dx4, dx5], true, true, undefined, false, true);
    meshd.rotation.y = -Math.PI;
    meshd.rotation.x = -Math.PI / 2;
    meshd.position.set(32, 7.765 - 6.95, -2.98 + 2.24)
    meshd.rotation.x = -3.274 / 3 + Math.PI / 2;

    const sxHw1 = new BABYLON.TransformNode('rd', scene);
    const sxw1 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 4, height: 5, depth: 1 });
    sxw1.position.set(16, 13.53 / 2, 0.5);
    sxw1.checkCollisions = true;
    sxw1.material = new BABYLON.StandardMaterial('c', scene);
    sxw1.material.alpha = 0.7;
    sxw1.parent = sxHw1;
    sxHw1.position.set(17.5 + 8.5, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 / 2);
    sxHw1.rotation.y = Math.PI;
    sxHw1.rotation.x = Math.PI / 2;

    const sxHw2 = new BABYLON.TransformNode('rd', scene);
    const sxw2 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 4, height: 5, depth: 1 });
    sxw2.position.set(16, 13.53 / 2, 0.5);
    sxw2.checkCollisions = true;
    sxw2.material = new BABYLON.StandardMaterial('c', scene);
    sxw2.material.alpha = 0.7;
    sxw2.parent = sxHw2;
    sxHw2.position.set(17.5 + 20.5, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 / 2);
    sxHw2.rotation.y = Math.PI;
    sxHw2.rotation.x = Math.PI / 2;

    const sxH1 = new BABYLON.TransformNode('rd', scene);
    const sx1 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 32, height: 13.53 - 9, depth: 1 });
    sx1.position.set(16, 13.53 / 2, 0.5);
    sx1.checkCollisions = true;
    sx1.material = roofMat;
    sx1.parent = sxH1;
    sxH1.position.set(32, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) / 2);
    sxH1.rotation.y = Math.PI;
    sxH1.rotation.x = Math.PI / 2;

    const sxH2 = new BABYLON.TransformNode('rd', scene);
    const sx2 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 32, height: 4, depth: 1 });
    sx2.position.set(16, 13.53 / 2, 0.5);
    sx2.checkCollisions = true;
    sx2.material = roofMat;
    sx2.parent = sxH2;
    sxH2.position.set(32, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 - 4 / 2);
    sxH2.rotation.y = Math.PI;
    sxH2.rotation.x = Math.PI / 2;

    const sxH3 = new BABYLON.TransformNode('rd', scene);
    const sx3 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 8, height: 5, depth: 1 });
    sx3.position.set(16, 13.53 / 2, 0.5);
    sx3.checkCollisions = true;
    sx3.material = sRoofMat;
    sx3.parent = sxH3;
    sxH3.position.set(20, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 / 2);
    sxH3.rotation.y = Math.PI;
    sxH3.rotation.x = Math.PI / 2;

    const sxH4 = new BABYLON.TransformNode('rd', scene);
    const sx4 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 8, height: 5, depth: 1 });
    sx4.position.set(16, 13.53 / 2, 0.5);
    sx4.checkCollisions = true;
    sx4.material = sRoofMat;
    sx4.parent = sxH4;
    sxH4.position.set(32, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 / 2);
    sxH4.rotation.y = Math.PI;
    sxH4.rotation.x = Math.PI / 2;

    const sxH5 = new BABYLON.TransformNode('rd', scene);
    const sx5 = new BABYLON.MeshBuilder.CreateBox('dx', { width: 8, height: 5, depth: 1 });
    sx5.position.set(20, 13.53 / 2, 0.5);
    sx5.checkCollisions = true;
    sx5.material = sRoofMat;
    sx5.parent = sxH5;
    sxH5.position.set(48, 3.48, - 1 + 13.53 / 2 - (13.53 - 9) - 5 / 2);
    sxH5.rotation.y = Math.PI;
    sxH5.rotation.x = Math.PI / 2;

    const meshs = BABYLON.Mesh.MergeMeshes([sxw1, sxw2, sx1, sx2, sx3, sx4, sx5], true, true, undefined, false, true);
    meshs.rotation.y = -Math.PI;
    meshs.rotation.x = -Math.PI / 2;
    meshs.position.set(0, 7.765 - 6.94, +22.75)
    meshs.rotation.y = Math.PI * 2;
    meshs.rotation.x = -3.274 / 3 + Math.PI / 2;

    const top = BABYLON.MeshBuilder.CreateCylinder("roof", { diameter: 1.03, height: 32, tessellation: 3 });
    //                                                             height/2,diameter/5.33049,diameter/2.3084
    top.scaling.x = 1.15;
    top.rotation.z = Math.PI / 2;
    top.rotation.x = Math.PI;
    top.material = sRoofMat;
    top.position.set(16, 10.32, 11);

    A.parent = hinge;
    B.parent = hinge;
    C.parent = hinge;
    D.parent = hinge;
    A1.parent = hinge;
    C1.parent = hinge;
    floorS.parent = hinge;
    floor.parent = hinge;
    wallFront.parent = hinge;
    wallBack.parent = hinge;
    meshd.parent = hinge;
    meshs.parent = hinge;
    top.parent = hinge;

    return hinge;
}