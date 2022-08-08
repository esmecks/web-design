document.addEventListener('DOMContentLoaded', () => {//Ovo stavljamo da se kod ucita poslije HTML-a
    const grid = document.querySelector('.grid');
    const Venos = document.createElement('div');
    let itsGameOver = false;
    let speed = 3;
    let platformCount = 5;
    let platforms = [];
    let score = 0;
    let VenosLeftSpace = 50;
    let startPoint = 150;
    let VenosBottomSpace = startPoint;
    const gravity = 0.9;
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    

    class Platform{
        constructor(newPlatformBottom){
            this.left = Math.random() * 315;//jer je sirina podloge 400
            this.bottom = newPlatformBottom;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    function createPlatforms(){
        for(let i = 0 ; i < platformCount; i++){
            let platformGap = 600 / platformCount;//Visina podloge podjeljenja na broj platformi
            let newPlatformBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatformBottom);
            platforms.push(newPlatform);
        }
    }

    function movePlatforms(){
        if(VenosBottomSpace > 200){
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if(platform.bottom < 10){
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    score ++;
                    var newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                }
            })
        }
    }

    function createVenos(){
        grid.appendChild(Venos);//stavlja Venos unutar podloge
        Venos.classList.add('Venos');
        VenosLeftSpace = platforms[0].left;
        Venos.style.left = VenosLeftSpace + 'px';//koristimo js kako bi u css smjestili Venos
        Venos.style.bottom = VenosBottomSpace + 'px';

    }

    function fall(){
        isJumping = false;
        clearInterval(upTimerId);
        downTimerId = setInterval(function () {
            VenosBottomSpace -= 5;
            Venos.style.bottom = VenosBottomSpace + 'px';
            if (VenosBottomSpace <= 0 ){
                gameOver();
            }
            platforms.forEach(platform => {
                if (
                    (VenosBottomSpace >= platform.bottom) &&
                    (VenosBottomSpace <= (platform.bottom + 15)) &&
                    ((VenosLeftSpace + 60) >= platform.left) &&
                    (VenosLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ){
                    startPoint = VenosBottomSpace;
                    jump();
                    isJumping = true;
                }
            })
        }, 20)
    }

    function jump(){
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function () {
            VenosBottomSpace += 20;
            Venos.style.bottom = VenosBottomSpace + 'px';
            if(VenosBottomSpace > startPoint + 200){
                fall();
                isJumping = false;
            }
        }, 20)
    }

    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function () {
            if (VenosLeftSpace >= 0){
            VenosLeftSpace -= 5;
            Venos.style.left = VenosLeftSpace + 'px';
            }
            else moveRight();
        }, 20)
    }

    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerId = setInterval(function () {
            if (VenosLeftSpace <= 370){
            VenosLeftSpace += 5;
            Venos.style.left = VenosLeftSpace + 'px';
            }
            else moveLeft();
        }, 20)
    }

    function moveStraight(){
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function control(e){
        Venos.style.bottom = VenosBottomSpace + 'px';
        if (e.key === "ArrowLeft"){
            moveLeft();
        }
        else if (e.key === "ArrowRight"){
            moveRight();
        }
        else if (e.key === "ArrowUp"){
            moveStraight();
        }
    }
     
    function gameOver(){
        itsGameOver = true;
        while(grid.firstChild){
            grid.removeChild(grid.firstChild);
        }
        grid.innerHTML = score;
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function start(){
        if(!itsGameOver){//ako igra nije zavrsena napravi Venos
            createPlatforms();
            createVenos();
            setInterval(movePlatforms, 30);
            jump(startPoint);
            document.addEventListener('keyup', control);
        }

    }

    start();

})