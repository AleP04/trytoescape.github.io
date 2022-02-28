'use strict'

function initGUI(scene, camera) {
    const music = new BABYLON.Sound("Music", "./sounds/start_game.mp3", scene, null, {
        autoplay: true
    });

    const advTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const images = [];
    for (let i = 1; i < 7; i++) {
        images[i] = "./textures/welcome" + i + ".png";
    }

    const imagePath = images[Math.floor(Math.random() * 6) + 1];

    const image = new BABYLON.GUI.Image("but", imagePath);
    image.width = "100%";
    image.height = "100%";
    advTexture.addControl(image);

    const storyText = new BABYLON.GUI.TextBlock("text2");
    storyText.textWrapping = true;
    storyText.text = `September 20, 2050.
    You are at school, just before the start of the lesson the teacher
    asks the class to go to the assembly hall.
    Once in the classroom you sit down and shortly after you faint.
    You wake up in the attic of a house.
    TRY TO ESCAPE FROM HERE!
    To do this you will have to solve a puzzle...
    But HURRY UP! If the time runs out you lose.`;
    storyText.color = "white";
    storyText.outlineColor = "black"
    storyText.outlineWidth = 3
    storyText.fontSize = "28px";
    storyText.top = "-31%"
    storyText.fontFamily = "Courier New"
    storyText.lineSpacing = "12px"
    advTexture.addControl(storyText);

    const tutorialText = new BABYLON.GUI.TextBlock("text2");
    tutorialText.textWrapping = true;
    tutorialText.text = `CONTROLS
    W - Move forward
    A - Move left
    D - Move right
    S - Move backward
    Mouse - Move camera
    Left Mouse Button - Interact with objects
    Enable audio for a better experience clicking the button to the top left`;
    tutorialText.color = "white";
    tutorialText.outlineColor = "black"
    tutorialText.outlineWidth = 3
    tutorialText.fontSize = "28px";
    tutorialText.top = "21%"
    tutorialText.fontFamily = "Courier New"
    tutorialText.lineSpacing = "12px"
    advTexture.addControl(tutorialText);

    const playButton = BABYLON.GUI.Button.CreateSimpleButton("play", "PLAY!");
    playButton.width = 0.04;
    playButton.height = "5%";
    playButton.top = "1.5%";
    playButton.color = "white";
    playButton.cornerRadius = 10;
    playButton.background = "darkcyan";
    advTexture.addControl(playButton);

    const playSound = new BABYLON.Sound("play", "./sounds/play.wav", scene);
    playButton.onPointerDownObservable.add(function () {
        playSound.play();
        advTexture.dispose();
        camera.attachControl(canvas, true);
        canvas.requestPointerLock();
        canvas.onclick = function () {
            canvas.requestPointerLock();
        }
        addHUD(scene);
    });
}

let timer;
function addHUD(scene) {
    //gun sight
    const advTextureHUD = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const image = new BABYLON.GUI.Image("but", "./textures/sight.png");
    image.width = "3.6%";
    image.height = "7.2%";
    advTextureHUD.addControl(image);

    let i = 60 * 4; // minutes

    timer = new BABYLON.GUI.TextBlock("text", new String(i));
    timer.top = "-44%";
    timer.color = "white";
    timer.fontSize = "40px";
    timer.fontFamily = "Courier New";
    timer.outlineColor = "black";
    timer.outlineWidth = 3;
    timer.text = "Time Left: "

    advTextureHUD.addControl(timer);

    const hintText = new BABYLON.GUI.TextBlock("text", scene);
    hintText.top = "48%";
    hintText.left = "38%";
    hintText.color = "white";
    hintText.fontSize = "20";
    hintText.fontFamily = "Courier New";
    hintText.outlineColor = "black";
    hintText.outlineWidth = 3;
    hintText.text = "Hold H to view game controls"

    advTextureHUD.addControl(hintText);

    const commandsText = new BABYLON.GUI.TextBlock("text", scene);
    commandsText.top = "35%";
    commandsText.left = "32%";
    commandsText.color = "white";
    commandsText.fontSize = "20";
    commandsText.fontFamily = "Courier New";
    commandsText.outlineColor = "black";
    commandsText.outlineWidth = 3;
    commandsText.text = `CONTROLS
    W - Move forward
    A - Move left
    D - Move right
    S - Move backward
    Mouse - Move camera
    Left Mouse Button - Interact with objects
    Enable audio for a better experience
    clicking the button to the top left`;
    commandsText.isVisible = false;

    advTextureHUD.addControl(commandsText);

    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                if (kbInfo.event.key == "h") {
                    commandsText.isVisible = true;
                    hintText.isVisible = false;
                }
                break;
            case BABYLON.KeyboardEventTypes.KEYUP:
                if (kbInfo.event.key == "h") {
                    commandsText.isVisible = false;
                    hintText.isVisible = true;
                }
                break;
        }
    });

    const gameOverSound = new BABYLON.Sound("go", "./sounds/gameover.wav", scene);



    const handle = window.setInterval(() => {
        i--;
        //let min = i / 60;
        //  let a = min.split(".");
        //  Math.floor(min);
        //  alert(a[0] + "----" + a[1]);

        timer.text = new String("Time Left: " + i);
        if (i === 0) {
            if (!camera.won) {
                gameOver(scene);
                gameOverSound.play();
            }
            else {
                timer.dispose();
            }
        }
    }, 1000);

}

function gameOver(scene) {
    const advTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const image = new BABYLON.GUI.Image("but", "./textures/gameover.png");
    image.width = "100%";
    image.height = "100%";
    advTexture.addControl(image);

    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const retry = BABYLON.GUI.Button.CreateSimpleButton("retry", "Retry?");
    retry.cornerRadius = 10;
    retry.thickness = 4;
    retry.width = 0.2;
    retry.height = "40px";
    retry.color = "red";
    retry.background = "black";
    advancedTexture.addControl(retry);

    const rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = 0.3;
    rect1.height = "40px";
    rect1.cornerRadius = 10;
    rect1.color = "red";
    rect1.thickness = 4;
    rect1.background = "black";
    rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect1.top = "50px";
    rect1.left = "50px";
    advancedTexture.addControl(rect1);

    const label = new BABYLON.GUI.TextBlock();
    label.text = "Press Esc to unlock the cursor";
    rect1.addControl(label);

    retry.onPointerDownObservable.add(function () {
        location.reload();
    });

}

function showPuzzleScreen(onPress) {
    const textPlane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 14, width: 14 });
    textPlane.position.set(13, 6.2, 19);

    const buttonPlane = BABYLON.Mesh.CreatePlane("plane", 3);
    buttonPlane.position.set(13, 4, 19);

    const advText = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(textPlane);

    const hintText = new BABYLON.GUI.TextBlock();
    hintText.text = `The exit door is locked!
    Complete the following sequence by putting
    cubes on the shelves in the correct order.
    Sequence: 0, 1, ...`;
    hintText.color = "white";
    hintText.fontSize = 50;

    advText.addControl(hintText);

    const advButton = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(buttonPlane);

    const startButton = BABYLON.GUI.Button.CreateSimpleButton("but1", "OK, Let's Start!");
    startButton.width = 1;
    startButton.cornerRadius = 90;
    startButton.height = 0.4;
    startButton.color = "white";
    startButton.fontSize = 130;
    startButton.background = "darkcyan";
    startButton.onPointerUpObservable.add(function () {
        textPlane.dispose();
        buttonPlane.dispose();
        onPress();
    });

    advButton.addControl(startButton);
}

function showCheckButton(check) {
    const buttonPlane = BABYLON.Mesh.CreatePlane("plane", 2);
    buttonPlane.position.set(1.2, 4, 6.8);
    buttonPlane.rotation.y = -Math.PI / 2;

    const advButton = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(buttonPlane);

    const checkButton = BABYLON.GUI.Button.CreateSimpleButton("but1", "Check Order!");
    checkButton.width = 1;
    checkButton.cornerRadius = 90;
    checkButton.height = 0.4;
    checkButton.color = "white";
    checkButton.fontSize = 130;
    checkButton.background = "darkcyan";
    checkButton.onPointerUpObservable.add(function () {
        if (check()) {
            checkButton.dispose();
            timer.dispose();
        }
    });

    advButton.addControl(checkButton);
}

function showHintRoomGUI() {
    const textPlane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 14, width: 14 });
    textPlane.position.set(13, 13.5, 14);
    textPlane.rotation.y = Math.PI / 2 + Math.PI / 4;

    const buttonPlane = BABYLON.Mesh.CreatePlane("plane", 3);
    buttonPlane.position.set(13, 12, 14);
    buttonPlane.rotation.y = Math.PI / 2 + Math.PI / 4;


    const advText = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(textPlane);

    const hintText = new BABYLON.GUI.TextBlock();
    hintText.text = `Fibonacci was an Italian mathematician
    from the Republic of Pisa.`;
    hintText.fontSize = 50;
    hintText.color = "white";

    advText.addControl(hintText);

    const advButton = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(buttonPlane);

    const startButton = BABYLON.GUI.Button.CreateSimpleButton("but1", "Close");
    startButton.width = 1;
    startButton.cornerRadius = 90;
    startButton.height = 0.4;
    startButton.color = "white";
    startButton.fontSize = 130;
    startButton.background = "darkcyan";
    startButton.onPointerUpObservable.add(function () {
        textPlane.dispose();
        buttonPlane.dispose();
    });

    advButton.addControl(startButton);
}

function showWinGUI() {
    const textPlane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 14, width: 14 });
    textPlane.position.set(-8, 3, 10);
    textPlane.rotation.y = -Math.PI / 2

    const buttonPlane = BABYLON.Mesh.CreatePlane("plane", 3);
    buttonPlane.position.set(-8, 1.5, 10);
    buttonPlane.rotation.y = -Math.PI / 2

    const advText = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(textPlane);

    const hintText = new BABYLON.GUI.TextBlock();
    hintText.text = `Congratulations,
    you managed to escape!`;
    hintText.fontSize = 50;
    hintText.color = "white";

    advText.addControl(hintText);

    const advButton = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(buttonPlane);

    const startButton = BABYLON.GUI.Button.CreateSimpleButton("but1", "Show End Screen");
    startButton.width = 1;
    startButton.cornerRadius = 90;
    startButton.height = 0.4;
    startButton.color = "white";
    startButton.fontSize = 130;
    startButton.background = "darkcyan";
    startButton.onPointerUpObservable.add(function () {
        textPlane.dispose();
        buttonPlane.dispose();
        showEndScreen();
    });

    advButton.addControl(startButton);
}

function showEndScreen() {
    const advTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const image = new BABYLON.GUI.Image("but", "./textures/endscreen.png");
    image.width = "100%";
    image.height = "100%";
    advTexture.addControl(image);

    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const gitHubButton = BABYLON.GUI.Button.CreateSimpleButton("visitGitHub", "Visit GitHub");
    gitHubButton.cornerRadius = 10;
    gitHubButton.thickness = 4;
    gitHubButton.width = 0.2;
    gitHubButton.top = "10%";
    gitHubButton.height = "40px";
    gitHubButton.color = "red";
    gitHubButton.background = "black";
    gitHubButton.onPointerDownObservable.add(function () {
        window.open("https://github.com/AleP04/try-to-escape/tree/demo", "_blank");
    });
    advancedTexture.addControl(gitHubButton);

    const rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = 0.3;
    rect1.height = "40px";
    rect1.cornerRadius = 10;
    rect1.color = "red";
    rect1.thickness = 4;
    rect1.background = "black";
    rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect1.top = "50px";
    rect1.left = "50px";
    advancedTexture.addControl(rect1);

    const label = new BABYLON.GUI.TextBlock();
    label.text = "Press Esc to unlock the cursor";
    rect1.addControl(label);

    retry.onPointerDownObservable.add(function () {
        location.reload();
    });

}