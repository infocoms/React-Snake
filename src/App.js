import React, {Component} from "react";
import Snake from "./Snake";
import Food from "./Food";
import Wall from "./Wall";
import Boost from "./Boost";
import Angel from "./Angel";

let high = 0;
let timer = "God Mode Timer";
let status = "Let's Play";
let level = 0;
let godmode = 0;
let currentspeed = "";


const getRandomCoordinates = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y];
};

const initialState = {
    wall1: getRandomCoordinates(),
    wall2: getRandomCoordinates(),
    wall3: getRandomCoordinates(),
    wall4: getRandomCoordinates(),
    wall5: getRandomCoordinates(),
    wall6: getRandomCoordinates(),
    wall7: getRandomCoordinates(),
    angelB: [139, 5],
    score: 0,
    boost2: getRandomCoordinates(),
    boost: getRandomCoordinates(),
    food: getRandomCoordinates(),
    speed: 100,
    direction: "RIGHT",
    snakeBlocks: [[2, 2], [4, 2], [6, 2]]
};

class App extends Component {
    constructor(props) {
        super();
        this.state = initialState;
    }

    speed() {
        clearInterval(this.interval);
        this.interval = setInterval(this.moveSnake, this.state.speed);
    }

    componentDidMount() {
        this.speed();
        document.onkeydown = this.onKeyDown;
    }


//GOD MODE FUNCTION
    /*checklevelforGodMode(){
        if (level === 1){
            this.state.angelB = [60,60];

        }
    }*/

    componentDidUpdate() {
        this.increaseScore();
        this.checkIfOutOfBorders();
        this.checkIfCollapsed();
        this.checkIfEat();
        this.checkIfHit();
        this.speed();
    }


    onKeyDown = e => {
        e = e || window.event;
        switch (e.keyCode) {
            case 38:
                this.setState({direction: "UP"});
                break;
            case 40:
                this.setState({direction: "DOWN"});
                break;
            case 37:
                this.setState({direction: "LEFT"});
                break;
            case 39:
                this.setState({direction: "RIGHT"});
                break;
            case 80:
                this.setState({speed: 10});

                break;
            default:
                break;
        }
    };


    moveSnake = () => {
        let block = [...this.state.snakeBlocks];
        let head = block[block.length - 1];

        switch (this.state.direction) {
            case "RIGHT":
                head = [head[0] + 2, head[1]];
                break;
            case "LEFT":
                head = [head[0] - 2, head[1]];
                break;
            case "DOWN":
                head = [head[0], head[1] + 2];
                break;
            case "UP":
                head = [head[0], head[1] - 2];
                break;
            default:
                break;
        }
        block.push(head);
        block.shift();
        this.setState({
            snakeBlocks: block
        });
    };

    checkIfOutOfBorders() {
        let head = this.state.snakeBlocks[this.state.snakeBlocks.length - 1];
        if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
            this.onGameOver();
        }
    }

    checkIfCollapsed() {
        let snake = [...this.state.snakeBlocks];
        let head = snake[snake.length - 1];
        snake.pop();
        snake.forEach(block => {
            if (head[0] === block[0] && head[1] === block[1]) {
                if (godmode === 1){
                    //special event when angel form
                }else {
                    this.onGameOver();
                }

            }
        });
    }

    checkIfHit(){
        let head = this.state.snakeBlocks[this.state.snakeBlocks.length - 1];
        let wall1 = this.state.wall1;
        let wall2 = this.state.wall2;
        let wall3 = this.state.wall3;
        let wall4 = this.state.wall4;
        let wall5 = this.state.wall5;
        let wall6 = this.state.wall6;
        let wall7 = this.state.wall7;

        if (head[0] === wall1[0] && head[1] === wall1[1]) {
            this.wallHit();
        }

        if (head[0] === wall2[0] && head[1] === wall2[1]){
            this.wallHit();
        }

        if (head[0] === wall3[0] && head[1] === wall3[1]){
            this.wallHit();
        }
        if (head[0] === wall4[0] && head[1] === wall4[1]){
            this.wallHit();
        }
        if (head[0] === wall5[0] && head[1] === wall5[1]){
            this.wallHit();
        }
        if (head[0] === wall6[0] && head[1] === wall6[1]){
            this.wallHit();
        }
        if (head[0] === wall7[0] && head[1] === wall7[1]){
            this.wallHit();
        }

    }

    checkIfEat() {
        let head = this.state.snakeBlocks[this.state.snakeBlocks.length - 1];
        let food = this.state.food;
        let angel = this.state.angelB;
        let boost = this.state.boost;
        let boost2 = this.state.boost2;
        if (head[0] === food[0] && head[1] === food[1] ) {
            let newState = {...this.state};
            newState.food = getRandomCoordinates();
            newState.snakeBlocks = this.enlargeSnake();
            newState.speed = this.increaseSpeed();
            newState.score = this.increaseScore();
            this.setState(newState);
            this.speed();
            this.increaseLevel();
        }
        if (head[0] === boost[0] && head[1] === boost[1] ) {
           this.boostHit();
        }
        if (head[0] === boost2[0] && head[1] === boost2[1] ) {
            this.boostHit();
        }
        if (head[0] === angel[0] && head[1] === angel[1] ) {
            this.godMode();
        }
    }


    enlargeSnake() {
        let newSnake = [...this.state.snakeBlocks];
        newSnake.unshift([]);
        return newSnake;

    }

   increaseLevel() {
        if (this.state.score === 3 || this.state.score === 9 || this.state.score === 29 || this.state.score === 39 || this.state.score === 49 || this.state.score === 59) {
            level = level + 1;
            status = ". . lvl up! . .";
            if (this.state.speed < 40){
                this.setState({speed: 30})
            }
            else {
                this.setState({speed: this.state.speed - 10});
                setTimeout(()=>{this.state.angelB = [50,50]; },2000);
                setTimeout(()=>{this.state.angelB = [139, 5]; },10000);
            }
        }
        else {

        }
    }

    increaseSpeed() {
        if (this.state.speed > 20) {
            status = "+ 1";
            setTimeout(()=>{status = ""; },2000);
            return this.state.speed;
        } else {

            return this.state.speed;
        }
    }


    godMode(){
        let newMode = {...this.state};
        status = "GOD MODE ACTIVATED 20s";
        setTimeout(()=>{timer = "20"; },1000);
        setTimeout(()=>{timer = "19"; },2000);
        setTimeout(()=>{timer = "18"; },3000);
        setTimeout(()=>{timer = "17"; },4000);
        setTimeout(()=>{timer = "16"; },5000);
        setTimeout(()=>{timer = "15"; },6000);
        setTimeout(()=>{timer = "14"; },7000);
        setTimeout(()=>{timer = "13"; },8000);
        setTimeout(()=>{timer = "12"; },9000);
        setTimeout(()=>{timer = "11"; },10000);
        setTimeout(()=>{timer = "10"; },11000);
        setTimeout(()=>{timer = "9"; },12000);
        setTimeout(()=>{timer = "8"; },13000);
        setTimeout(()=>{timer = "7"; },14000);
        setTimeout(()=>{timer = "6"; },15000);
        setTimeout(()=>{timer = "5"; },16000);
        setTimeout(()=>{timer = "4"; },17000);
        setTimeout(()=>{timer = "3"; },18000);
        setTimeout(()=>{timer = "2"; },19000);
        setTimeout(()=>{timer = "1"; },20000);
        setTimeout(()=>{timer = "God Mode Timer"; },21000);
        setTimeout(()=>{status = ""; },2000);

        newMode.angelB = [139, 5];
        this.setState(newMode);
        godmode = 1;
        setTimeout(()=>{godmode = 0; },20000);
    }

    boostHit(){
        let newCoor = {...this.state};
        newCoor.boost = getRandomCoordinates();
        newCoor.boost2 = getRandomCoordinates();
        newCoor.speed = this.boostUp();
        this.setState(newCoor);
        this.speed();
    }

    wallHit(){
        this.onGameOver();
        let newCoorWall = {...this.state};
        newCoorWall.wall1 = getRandomCoordinates();
        newCoorWall.wall2 = getRandomCoordinates();
        newCoorWall.wall3 = getRandomCoordinates();
        newCoorWall.wall4 = getRandomCoordinates();
        newCoorWall.wall5 = getRandomCoordinates();
        newCoorWall.wall6 = getRandomCoordinates();
        newCoorWall.wall7 = getRandomCoordinates();
        this.setState(newCoorWall);
        this.onGameOver();
        //game over function goes here
    }

    boostUp() {
        if (this.state.speed <= 30){
            currentspeed = this.state.speed;
            status = "Yi HA!!";
            setTimeout(()=>{status = ""; },2000);
            setTimeout(()=>{this.state.speed = currentspeed; },10000);
            return this.state.speed = 30;

        }else {
            currentspeed = this.state.speed;
            status = "Yi HA!!";
            setTimeout(()=>{status = ""; },2000);
            setTimeout(()=>{this.state.speed = currentspeed; },10000);
            return this.state.speed = 30;
        }


    }


    increaseScore() {
        return this.state.score + 1;
    }



    onGameOver() {
        //alert(`Game Over. Snake length is ${this.state.snakeBlocks.length}`);
        if (high < this.state.score){
            high = this.state.score;
        }
        timer = "God Mode Timer";
        godmode = 0;
        level = 0;
        status = "Game Over!";
        setTimeout(()=>{status = "Lets try that again?"; },2000);
        setTimeout(()=>{status = ""; },3000);
        this.setState(initialState);
    }


    render() {
        return (
            <fragment>
                <div className="title">
                    <h1 className="GameTitle">NEON SNAKE ™</h1>
                    <p>Score: <b className="UI">{this.state.score}</b>
                        Level: <b className="UI">{level}</b>
                        Length: <b className="UI">{this.state.snakeBlocks.length}</b>
                        High Score: <b className="UI">{high}</b>
                    </p>
                </div>
                <div className="GameIndex">
                    <h1 className="IndexTitle">Guide</h1>

                    <p className="space"><img src="https://image.flaticon.com/icons/png/512/771/771266.png" className="guideicon" alt="icon"/> Food</p>
                    <p className="space"><img src="https://image.flaticon.com/icons/png/512/1069/1069280.png" className="guideicon" alt="icon"/> Boost</p>
                    <p className="space"><img src="https://image.flaticon.com/icons/png/512/2327/2327312.png" className="guideicon" alt="icon"/> God Mode</p>
                    <p className="space"><img src="https://image.flaticon.com/icons/svg/359/359399.svg" className="guideicon" alt="icon"/> Wall</p>

                </div>
                <div className="game-area">
                    <Snake snakeBlocks={this.state.snakeBlocks}/>
                    <Food block={this.state.food}/>
                    <Angel block={this.state.angelB}/>
                    <Boost block={this.state.boost}/>
                    <Boost block={this.state.boost2}/>
                    <Wall block={this.state.wall1}/>
                    <Wall block={this.state.wall2}/>
                    <Wall block={this.state.wall3}/>
                    <Wall block={this.state.wall4}/>
                    <Wall block={this.state.wall5}/>
                    <Wall block={this.state.wall6}/>
                    <Wall block={this.state.wall7}/>
                    <h1 className="Timer">{timer}</h1>
                    <h2 className="Info">{status}</h2>
                </div>
            </fragment>
        );
    }
}

export default App;
