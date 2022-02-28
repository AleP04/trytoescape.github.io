'use strict'

function createSkybox(scene) {
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./skybox/sky", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
}

function createGround(scene) {
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { height: 200, width: 200 });
    ground.checkCollisions = true;

    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseTexture = new BABYLON.Texture("./textures/ground_d.jpg", scene);
    groundMat.diffuseTexture.uScale = groundMat.diffuseTexture.vScale = 10;
    ground.material = groundMat;
}

function createTrees(treeNumber, minX, minZ, maxX, maxZ) {
    const spriteManagerTrees1 = new BABYLON.SpriteManager("treesManager1", "textures/tree_type_1.png", treeNumber / 2,
        { width: 512, height: 1024 });

    const spriteManagerTrees2 = new BABYLON.SpriteManager("treesManager2", "textures/tree_type_2.png", treeNumber / 2,
        { width: 600, height: 1024 });

    for (let i = 0; i < treeNumber; i++) {
        const tree = new BABYLON.Sprite("treeT1", spriteManagerTrees1);
        const treeNoLeaf = new BABYLON.Sprite("treeT2", spriteManagerTrees2);
        tree.width = 6;
        tree.height = 12;
        tree.position.x = BABYLON.Scalar.RandomRange(minX, maxX);
        tree.position.z = BABYLON.Scalar.RandomRange(minZ, maxZ);
        tree.position.y = 1.7;
        treeNoLeaf.width = 6;
        treeNoLeaf.height = 12;
        treeNoLeaf.position.x = BABYLON.Scalar.RandomRange(minX, maxX);
        treeNoLeaf.position.z = BABYLON.Scalar.RandomRange(minZ, maxZ);
        treeNoLeaf.position.y = 1.5;
    }
}

function createLimits(scene) {
    const wall1 = BABYLON.MeshBuilder.CreateGround("wall", { height: 200, width: 100 });
    wall1.rotation.z = -Math.PI / 2;
    wall1.checkCollisions = true;
    wall1.isVisible = false;
    wall1.position.set(-75, 0, 0);

    const wall2 = BABYLON.MeshBuilder.CreateGround("wall", { height: 200, width: 100 });
    wall2.rotation.z = Math.PI / 2;
    wall2.checkCollisions = true;
    wall2.isVisible = false;
    wall2.position.set(75, 0, 0);

    const wall3 = BABYLON.MeshBuilder.CreateGround("wall", { height: 200, width: 100 });
    wall3.rotation.z = Math.PI / 2;
    wall3.rotation.y = Math.PI / 2;
    wall3.checkCollisions = true;
    wall3.isVisible = false;
    wall3.position.set(0, 0, -75);

    const wall4 = BABYLON.MeshBuilder.CreateGround("wall", { height: 200, width: 100 });
    wall4.rotation.y = Math.PI / 2;
    wall4.rotation.z = -Math.PI / 2;
    wall4.checkCollisions = true;
    wall4.isVisible = false;
    wall4.position.set(0, 0, 75);
}