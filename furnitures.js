'use strict';

function createPicture(scene, texture) {
    const frameHinge = new BABYLON.TransformNode(scene);

    const image = new BABYLON.MeshBuilder.CreateBox('fibPicture', { width: 2.2, height: 3, depth: 0.1 }, scene)
    const imageMat = new BABYLON.StandardMaterial('fM', scene);
    imageMat.diffuseTexture = new BABYLON.Texture(texture);
    image.material = imageMat;
    image.rotation.y = -Math.PI / 2;
    image.position.set(-0.1, 4.1, 2.2)
    image.parent = frameHinge

    BABYLON.SceneLoader.ImportMesh("", "", "./assets/frame.babylon", scene, function (newMeshes) {
        const _hinge = new BABYLON.TransformNode(scene);
        const frame = newMeshes[0];
        const frameMat = new BABYLON.StandardMaterial('fM', scene);
        frameMat.diffuseTexture = new BABYLON.Texture("./textures/gold.jpg")
        frame.checkCollisions = true;
        frame.position.set(1, 1.18, 0);
        frame.material = frameMat
        frame.parent = _hinge;
        _hinge.scaling.x = 2.2
        _hinge.scaling.y = 2
        _hinge.rotation.y = -Math.PI / 2;
        _hinge.parent = frameHinge;
    });
    return frameHinge
}

function createBookshelf(scene) {
    const hinge = new BABYLON.TransformNode(scene);
    BABYLON.SceneLoader.ImportMesh("", "", "./assets/bookshelf.babylon", scene, function (newMeshes) {
        const shelf = newMeshes[0];
        const shelfMat = new BABYLON.StandardMaterial('sM', scene);
        shelfMat.diffuseTexture = new BABYLON.Texture("./textures/shelf.bmp");
        shelf.material = shelfMat;
        shelf.scaling.set(0.04, 0.04, 0.04);
        shelf.position.y = -0.6

        const books = newMeshes[1];
        const booksMat = new BABYLON.StandardMaterial('sM', scene);
        booksMat.diffuseTexture = new BABYLON.Texture("./textures/books.bmp");
        books.checkCollisions = true;
        books.material = booksMat;
        books.scaling.set(0.04, 0.04, 0.04);
        books.position.y = -0.6;
        shelf.parent = hinge;
        books.parent = hinge;
    });
    return hinge;
}

function createBoard(scene) {
    const boardHinge = new BABYLON.TransformNode(scene);
    BABYLON.SceneLoader.ImportMesh("", "", "./assets/board.babylon", scene, function (newMeshes) {
        const board = newMeshes[0];
        const boardMat = new BABYLON.StandardMaterial('bM', scene);
        boardMat.diffuseTexture = new BABYLON.Texture("./textures/board.jpg");
        board.checkCollisions = true;
        board.material = boardMat;
        board.scaling.set(0.25, 0.25, 0.25);
        board.parent = boardHinge
    });
    return boardHinge;
}

function createDesk(scene) {
    const deskChair = new BABYLON.TransformNode(scene);

    BABYLON.SceneLoader.ImportMesh("", "", "./assets/desk.babylon", scene, function (newMeshes) {
        const desk = newMeshes[0];
        const deskMat = new BABYLON.StandardMaterial('dM', scene);
        deskMat.diffuseTexture = new BABYLON.Texture("./textures/desk.jpg");
        desk.checkCollisions = true;
        desk.material = deskMat;
        desk.scaling.set(0.026, 0.026, 0.026);
        desk.parent = deskChair;
    });

    BABYLON.SceneLoader.ImportMesh("", "", "./assets/chair.babylon", scene, function (newMeshes) {
        const chair = newMeshes[0];
        chair.checkCollisions = true;
        chair.position.z = -1.5;
        chair.rotation.y = Math.PI;
        chair.parent = deskChair;
    });
    return deskChair;
}

function createWallShelf(scene) {
    const hinge = new BABYLON.TransformNode(scene);
    BABYLON.SceneLoader.ImportMesh("", "", "./assets/wall_shelf.babylon", scene, function (newMeshes) {
        const shelf = newMeshes[0];
        const shelfMat = new BABYLON.StandardMaterial('dM', scene);
        shelfMat.diffuseTexture = new BABYLON.Texture("./textures/stairs.jpg")
        shelf.checkCollisions = true;
        shelf.material = shelfMat;
        // shelf.rotation.y = Math.PI / 2;
        // shelf.position.set(22, 3.4, 1.55);
        shelf.parent = hinge;
    });
    return hinge;
}

function createLamp() {
    let bottomCylinder = new BABYLON.MeshBuilder.CreateCylinder('cy', { height: 0.5, diameter: 0.35, tessellation: 60 })
    let goldenMetal = bottomCylinder.material = new BABYLON.StandardMaterial("mat-cylinder", scene)
    goldenMetal.diffuseTexture = new BABYLON.Texture("./textures/gold.jpg", scene);
    let topCylinder = new BABYLON.MeshBuilder.CreateCylinder('cy', { height: 0.24, diameter: 0.55, tessellation: 60 })
    topCylinder.material = goldenMetal;
    let topHorizontalBar = new BABYLON.MeshBuilder.CreateCylinder('cy', { height: 0.5, diameter: 0.05, tessellation: 60 })
    topHorizontalBar.rotation.z = Math.PI / 2;
    topHorizontalBar.material = goldenMetal;
    let bottomHorizontalBar = new BABYLON.MeshBuilder.CreateCylinder('cy', { height: 0.5, diameter: 0.05, tessellation: 60 })
    bottomHorizontalBar.rotation.z = Math.PI / 2;
    bottomHorizontalBar.material = goldenMetal;
    let wallAttachment = new BABYLON.MeshBuilder.CreateCylinder('cy', { height: 0.16, diameter: 0.55, tessellation: 60 })
    wallAttachment.position.set(0.16 / 2, 0.55 / 2, 0.55 / 2);
    //wallAttachment.position.set(-1.3, 2.25, -3);
    wallAttachment.rotation.z = Math.PI / 2;
    wallAttachment.material = goldenMetal;
    let lamp = new BABYLON.MeshBuilder.CreateSphere('s', { diameter: 1 }, scene);
    /* lamp.position.set(-2, 3, -3);
    bottomCylinder.position.set(-2, 2.3, -3);
    bottomHorizontalBar.position.set(-1.6, 2.2, -3);
    topHorizontalBar.position.set(-1.6, 2.3, -3);
    topCylinder.position.set(-2, 2.54, -3); */

    lamp.position.set(0.78, 1.1, 0.275);
    bottomCylinder.position.set(0.78, 0.295, 0.275);
    bottomHorizontalBar.position.set(0.38, 0.325, 0.275);
    topHorizontalBar.position.set(0.38, 0.225, 0.275);
    topCylinder.position.set(0.78, 0.1
        + 0.5, 0.275);



    let lampMaterial = new BABYLON.StandardMaterial("sphere1", scene);
    lampMaterial.emissiveColor = new BABYLON.Color3(1.0, 1.0, 0.7);
    lamp.material = lampMaterial;

    let lampLight = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 0, 0), scene);
    lampLight.position = lamp.position;
    lampLight.range = 30;
    lampLight.intensity = 0.2;
    //lampLight.diffuse = new BABYLON.Color3(1, 0.87, 0.5);

    lampLight.parent = lamp;

    let lampGlow = new BABYLON.GlowLayer("glow", scene);
    lampGlow.intensity = 0.2;

    let hinge = new BABYLON.TransformNode(scene);
    hinge.position.set(-1.3, 2.25, -3);

    bottomCylinder.parent = hinge;
    topCylinder.parent = hinge;
    bottomHorizontalBar.parent = hinge;
    topHorizontalBar.parent = hinge;
    wallAttachment.parent = hinge;
    lamp.parent = hinge;
    return hinge;
}

function createStand(x, y, z, angle) {
    BABYLON.SceneLoader.ImportMesh("", "", "./assets/stand.babylon", scene, function (newMeshes) {
        const shelf = newMeshes[0];
        const shelfMat = new BABYLON.StandardMaterial('dM', scene);
        shelfMat.diffuseTexture = new BABYLON.Texture("./textures/stairs.jpg");
        shelf.checkCollisions = true;
        shelf.material = shelfMat;
        shelf.position.set(x, y, z);
        shelf.rotation.y = angle;
    });
}

function createBed(x, y, z, angolo) {
    BABYLON.SceneLoader.ImportMesh("", "", "./assets/bed.babylon", scene, function (newMeshes) {
        let bed = newMeshes[0];
        bed.position.set(x, y, z)
        bed.scaling.set(1.6, 1.6, 1.6);
        bed.checkCollisions = true;
        bed.rotation.y = angolo;
    });
}

function createCradle(x, y, z) {
    BABYLON.SceneLoader.ImportMesh("", "", "./assets/cradle.babylon", scene, function (newMeshes) {
        let cradle = newMeshes[0];
        cradle.position.set(x, y, z)
        cradle.scaling.set(0.002, 0.002, 0.002);
        cradle.checkCollisions = true;
        const cradlet = new BABYLON.StandardMaterial('Mc', scene);
        cradlet.diffuseTexture = new BABYLON.Texture("./textures/wood_cradle.jpg")
        cradle.material = cradlet;
    });
}

function createCardboard(x, y, z, angolo) {
    let cardboard = new BABYLON.MeshBuilder.CreateBox("cardboard", { width: 1.5, height: 1.5, depth: 1.5 }, scene);
    cardboard.checkCollisions = true;
    cardboard.position.set(x, y, z);
    cardboard.rotation.y = angolo;
    const cardboardT = new BABYLON.StandardMaterial('Mc', scene);
    cardboardT.diffuseTexture = new BABYLON.Texture("./textures/cardboard.jpg");
    cardboardT.bumpTexture = new BABYLON.Texture("./textures/cardboard_bump.jpg");
    cardboard.material = cardboardT;
}

function createRailing(scene) {
    const hinge = new BABYLON.TransformNode(scene);
    BABYLON.SceneLoader.ImportMesh("", "", "./assets/railing.babylon", scene, function (newMeshes) {
        const railing = newMeshes[0];
        railing.checkCollisions = true;
        const ralingMat = new BABYLON.StandardMaterial('Mc', scene);
        ralingMat.diffuseTexture = new BABYLON.Texture("./textures/wood_cradle.jpg")
        railing.material = ralingMat;
        railing.material = ralingMat;
        railing.parent = hinge;
    });
    return hinge;
}