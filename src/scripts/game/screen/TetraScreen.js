import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import Screen from '../../screenManager/Screen'
import Grid from '../elements/Grid'
import Piece from '../elements/Piece'
import LevelTarget from '../elements/LevelTarget'
import Enemy from '../elements/Enemy'
import Bomb from '../elements/Bomb'
import Block from '../elements/Block'
import Board from '../core/Board'
import GameplayData from '../data/GameplayData'
import LevelData from '../data/LevelData'
import ShatterParticle from '../effects/ShatterParticle'

import InGameHUD from '../ui/InGameHUD'

export default class TetraScreen extends Screen {
    constructor(label) {
            super(label);



            window.CARD_NUMBER = 0;

            window.CURRENT_LEVEL = 0;

            this.grid = new Grid(this);
            this.board = new Board(this);
            this.totalLines = 6;

            this.cardQueue = [];
            this.cardQueueSize = 2;

            this.highscore = parseInt(document.cookie) || 0;

            this.currentButtonLabel = 'START';

            this.levelProgression = [30, 30, 30, 29, 29, 28, 28, 26, 26, 25, 25, 22, 22, 20, 20];
            this.currentLevelProgression = 0;

            // this.backgroundEffects = new BackgroundEffects();
            // this.addChild(this.backgroundEffects)

            this.gameContainer = new PIXI.Container();
            this.gridContainer = new PIXI.Container();
            this.cardsContainer = new PIXI.Container();
            this.particlesContainer = new PIXI.Container();



            this.UIContainer = new PIXI.Container();

            this.vignette = new PIXI.Sprite(PIXI.Texture.from('vignette.png'));
            this.UIContainer.addChild(this.vignette);

            this.vignette.width = config.width;
            this.vignette.height = config.height;

            this.addChild(this.gameContainer);

            // this.gameContainer.addChild(this.backgroundEffects);
            this.gameContainer.addChild(this.gridContainer);
            this.gameContainer.addChild(this.cardsContainer);
            this.gameContainer.addChild(this.particlesContainer);

            this.addChild(this.UIContainer);

            this.gameplayData = new GameplayData();
            this.currentLevelData = new LevelData();


            this.particlesList = [];
            this.mapSrc = './assets/json/aries/aries-0-0-0.json';
            this.updateable = false;

            this.interactive = true;


            // this.visible = false
            //this.startLoad();

        }
        //load json of level
    loadLevelData(levelData) {

            if (!levelData || !levelData.levelPath) {
                this.mapSrc = './assets/json/aries/aries-0-0-0.json';
                this.currentLevelData.levelName = ' aries'
                this.currentLevelData.levelPosition = '0-0-0';
                console.log('NO LEVEL DATA');
            } else {
                this.mapSrc = levelData.levelPath;
                this.currentLevelData.levelName = levelData.levelName;
                this.currentLevelData.levelPosition = levelData.levelPosition;
            }

            if (RESOURCES[this.mapSrc]) {
                this.buildLevelData();
            } else {
                PIXI.loader
                    .add(this.mapSrc)
                    .load(this.buildLevelData.bind(this));
            }
        }
        //read the json and create the level
    buildLevelData() {

        let loader = new PIXI.loaders.Loader(); // you can also create your own if you want

        let map = RESOURCES[this.mapSrc].data;
        // console.log(map);
        // console.log(map.height);
        let tempLevel = [];
        let tempOverlayLevel = [];
        let acc = 0;
        let str = '';
        let layers = map.layers;

        // console.log(map);
        for (var k = 0; k < layers.length; k++) {
            acc = 0;
            str = '';
            if (layers[k].type == 'tilelayer') {
                tempLevel = [];
                for (var i = 0; i < map.height; i++) {
                    let tempLine = [];
                    for (var j = 0; j < map.width; j++) {
                        // console.log(layers[k].type);
                        let tileId = layers[k].data[acc] - 1;
                        // console.log(map.tilesets[0].tileproperties[layers[k].data[acc]]);
                        if (tileId >= 0) {
                            tempLine.push(TILESET_PROPERTIES[tileId]);
                            str += '--' + TILESET_PROPERTIES[tileId].type.substring(0, 4) + '--' //layers[k].data[acc]
                        } else {
                            tempLine.push(null);
                            str += '--NONE--'
                        }
                        acc++;

                    }
                    tempLevel.push(tempLine);
                    str += '\n'
                }
            } else {
                acc = 0;
                // for (var i = 0; i < map.height; i++) {

                for (var i = 0; i < layers[k].objects.length; i++) {
                    let obj = {
                        properties: layers[k].objects[i].properties,
                        pos: {
                            i: layers[k].objects[i].x / layers[k].objects[i].width,
                            j: layers[k].objects[i].y / layers[k].objects[i].height - 1
                        }
                    }
                    tempOverlayLevel.push(obj);
                }

            }
            // console.log(str);
            // console.log('----------');
        }

        this.currentLevelData.maxMoves = map.properties ? map.properties.maxMoves : 100;
        this.currentLevelData.targetLife = map.properties ? map.properties.targetLife : 5;
        this.currentLevelData.i = map.width;
        this.currentLevelData.j = map.height;
        this.currentLevelData.map = tempLevel;
        this.currentLevelData.overlayMap = tempOverlayLevel;

        this.afterLoad();
    }

    redirectToInit() {
        this.screenManager.change('StartScreen');
    }

    buildUI() {
        this.inGameHUD = new InGameHUD(this);

        this.UIContainer.addChild(this.inGameHUD);
        this.cardQueueContainer = new PIXI.Container();
        this.UIContainer.addChild(this.cardQueueContainer)
    }

    afterLoad() {
        this.buildUI();

        this.resetGameStats();

        this.updateUI();

        this.startNewGame();

        this.inGameHUD.build(this.currentLevelData);

        this.screenManager.toGame();

        let stars = {
            speed: this.screenManager.backgroundEffects.currentSpeed.y
        }

        TweenLite.to(stars, 1, {
            delay: 0.5,
            speed: 0.0005,
            onUpdate: function() {
                this.screenManager.moveStarsVertical(stars.speed);
            }.bind(this)
        })

        // this.screenManager.backgroundEffects.starsDeacc = 0.999;
    }
    build(param) {
        super.build();

        window.EFFECTS.container = this.gameContainer;
        SOUND_MANAGER.fadeOut('dream1');
        SOUND_MANAGER.fadeIn('dream2');

        this.loadLevelData(param);
    }

    resetGrid() {



        window.GRID = {
            i: this.currentLevelData.i,
            j: this.currentLevelData.j,
            height: config.height * 0.7,
            width: config.width * 0.9,
        }


        let wratio = (GRID.i / GRID.width);
        let hratio = (GRID.j / GRID.height);

        if (wratio < hratio) {
            window.CARD = {
                width: GRID.height / GRID.j,
                height: GRID.height / GRID.j, //GRID.height / GRID.j
            }
        } else {
            window.CARD = {
                width: GRID.width / GRID.i,
                height: GRID.width / GRID.i, //GRID.height / GRID.j
            }
        }

        let maxW = config.width * 0.12
        window.CARD.width = Math.min(window.CARD.width, maxW)
        window.CARD.height = Math.min(window.CARD.height, maxW)

        window.GRID.width = window.GRID.i * CARD.width;
        window.GRID.height = window.GRID.j * CARD.height;

        this.mousePosID = (GRID.i / 2)

        // alert('resetGrid')
        this.grid.destroyGrid();
        this.grid.createGrid();
        this.gridContainer.addChild(this.grid);
        // utils.centerObject(this.gridContainer, this.background.background);
        this.gridContainer.x = config.width / 2 - this.gridContainer.width / 2;
        this.gridContainer.y = config.height / 2 - this.gridContainer.height / 2 - 20;
        this.cardsContainer.x = this.gridContainer.x;
        this.cardsContainer.y = this.gridContainer.y;
        this.particlesContainer.x = this.gridContainer.x;
        this.particlesContainer.y = this.gridContainer.y;
        // this.gridContainer.y -= CARD.height;
        this.initGridY = this.gridContainer.y;
        this.initGridAcc = 0;
    }
    startNewGame() {
        this.resetGameStats();
        this.updateUI();
        this.resetGame();
    }
    resetGameStats() {
        this.currentPointsLabel = 0;
        this.currentLevelProgression = 0;
        this.gameplayData.reset();
    }
    getParticle(size) {
        let particle = null;
        if (GAME_PARTICLES_POOL.length > 0) {
            particle = GAME_PARTICLES_POOL[0];
            GAME_PARTICLES_POOL.shift();
        }

        if (!particle) {
            particle = new ShatterParticle(size);
        }
        particle.reset(size);

        return particle

    }
    addDestroyedCardParticles(card) {
        for (var i = 0; i < 8; i++) {
            let particle = this.getParticle(CARD.width / 8);
            this.particlesContainer.addChild(particle);
            particle.x = card.x + CARD.width / 2 + Math.random() * CARD.width / 2 - CARD.width / 4
            particle.y = card.y + CARD.height / 2 + Math.random() * CARD.height / 2 - CARD.height / 4

            particle.velocity.x = Math.random() * 4 - 2;
            particle.velocity.y = -Math.random() * 2 - 1;

            particle.graphics.tint = card.cardSprite.tint;

            this.particlesList.push(particle);
        }
    }
    resetGame() {

        this.gameplayData.reset();
        this.gameplayData.maxMoves = this.currentLevelData.maxMoves;
        // let levels = ["morning" ,"day", "night"]

        this.updateUI();

        this.resetGrid();

        this.cardQueueContainer.x = 5;
        this.cardQueueContainer.y = config.height - CARD.height - 5

        // this.board.destroyBoard();
        this.board.resetBoard(this.grid);

        this.board.cardDestroyed.add(this.addDestroyedCardParticles.bind(this));

        this.mousePosition = {
            x: 0,
            y: 0
        }

        // for (var i = this.cardQueue.length - 1; i >= 0; i--) {
        //     this.cardQueue[i].forceDestroy();
        // }
        this.cardQueue = []

        // if (this.currentCard) {
        //     this.currentCard.forceDestroy();
        //     console.log(this.currentCard);
        // }

        this.currentCard = null;

        for (var i = 0; i < this.currentLevelData.map.length; i++) {
            for (var j = 0; j < this.currentLevelData.map[i].length; j++) {
                let entityData = this.currentLevelData.map[i][j];
                if (entityData) {
                    // console.log(entityData);
                    this.placeCard(j, i, entityData);
                    // this.cardsContainer.addChild(this.placeCard(j, i, entityData));
                }

            }
        }

        for (var i = 0; i < this.currentLevelData.overlayMap.length; i++) {
            let entityData = this.currentLevelData.overlayMap[i];
            if (entityData) {
                // console.log(entityData.i, entityData.j,entityData.properties);
                this.placeCard(entityData.pos.i, entityData.pos.j, entityData.properties);
                // this.cardsContainer.addChild(this.placeCard(j, i, entityData));

            }
        }


        this.board.countCards();

        // console.log(this.board.cards);

        // for (var i = 0; i < this.board.cards.length; i++) {
        //     for (var j = 0; j < this.board.cards[i].length; j++) {
        //         if (this.board.cards[i][j] != 0) {
        //             console.log(this.board.cards[i][j].cardNumber, this.board.cards[i][j].parent);
        //         }
        //     }
        // }
        this.addEvents();
        setTimeout(function() {
            this.newRound();
        }.bind(this), 500);

        TweenLite.to(this.gridContainer, 0.5, {
            alpha: .7
        })
        this.currentButtonLabel = 'RESET';

        this.gameStarted = true;

        this.mousePosID = GRID.i / 2;
        if (!this.trailMarker) {
            this.trailMarker = new PIXI.Sprite(PIXI.Texture.from('trail.png'));
            this.cardsContainer.addChild(this.trailMarker);
            this.trailMarker.anchor.set(0.5, 1);
            this.trailMarker.scale.set(CARD.width / this.trailMarker.width)
        }
        this.trailMarker.width = CARD.width;
        this.trailMarker.alpha = 0;

    }


    updateUI() {
        if (this.inGameHUD) {
            this.inGameHUD.updateHUD(this.gameplayData);
        }
    }

    addPoints(points) {
        this.gameplayData.currentPoints += points;
        if (this.highscore < this.gameplayData.currentPoints) {
            this.highscore = this.gameplayData.currentPoints;
            document.cookie = "" + this.highscore;
        }
        TweenLite.to(this.gameplayData, 0.2, {
            currentPointsLabel: this.gameplayData.currentPoints,
            onUpdate: function() {
                this.gameplayData.currentPointsLabel = Math.ceil(this.gameplayData.currentPointsLabel);
                this.updateUI();
            }.bind(this)
        });

    }

    updateQueue() {
        while (this.cardQueue.length <= this.cardQueueSize) {
            let card = null;
            if (CARD_POOL.length) {
                for (var i = 0; i < CARD_POOL.length; i++) {
                    if (CARD_POOL[i] instanceof Piece) {
                        card = CARD_POOL[i];
                        console.log(card);
                        CARD_POOL.splice(i, 1);
                        break;
                    }
                }
            }

            if (!card) {
                card = new Piece(this)
            }
            // console.log('queue ', card.cardNumber);
            card.life = Math.random() < 1 - (this.gameplayData.currentRound % 3) * 0.17 ? 0 : Math.random() < 0.5 ? 2 : 1;
            card.resetCard();
            card.type = 0;
            card.x = 0;
            card.y = 0;
            this.cardQueueContainer.addChild(card);
            this.cardQueue.push(card);
        }
        // for (var i = this.cardQueue.length - 1; i >= 0; i--) {
        for (var i = 1; i < this.cardQueue.length; i++) {
            let scl = 0.65 // - (i/this.cardQueue.length) * 0.1;
            this.cardQueue[i].y = CARD.height * (1 - scl);
            TweenLite.to(this.cardQueue[i].scale, 0.3, {
                x: scl,
                y: scl,
                ease: Back.easeOut
            })
            TweenLite.to(this.cardQueue[i], 0.3, {
                x: (CARD.width * scl) * (this.cardQueue.length - i - 1),
                ease: Back.easeOut
            })
        }

    }
    newRound() {

        if (this.gameplayData.getRoundsToDie() <= 0) {
            this.gameOverRedirect();
            return
        }

        this.updateQueue();
        this.currentCard = this.cardQueue[0];
        this.cardQueue.shift();
        this.mousePosID = (GRID.i / 2)
        // this.currentCard.x = CARD.width * Math.ceil(this.mousePosID);
        this.currentCard.x = CARD.width * Math.floor(this.mousePosID);
        this.currentCard.y = this.gridContainer.height + CARD.height * 2;
        this.currentCard.alpha = 0;
        // this.currentCard.alpha = 1;
        TweenLite.to(this.currentCard, 0.3, {
            alpha: 1,
            y: this.gridContainer.height, // + this.gridContainer.height,
            ease: Elastic.easeOut
        })
        TweenLite.to(this.currentCard.scale, 0.3, {
            x: 1,
            y: 1,
            ease: Back.easeOut
        })
        this.currentCard.updateCard();
        this.cardsContainer.addChild(this.currentCard);
        this.mousePosition.x = this.currentCard.x;
        TweenLite.to(this.trailMarker, 0.2, {
            alpha: 1
        });
        this.trailMarker.x = this.currentCard.x + CARD.width * 0.5;
        this.trailMarker.y = this.gridContainer.height + CARD.height
        // TweenLite.to(this.trailMarker, 0.1, {x:this.mousePosID * (CARD.width) + CARD.width / 2});
        // this.updateMousePosition();
    }

    placeCard(i, j, entityData = null) {
        if (!entityData) {
            return
        }
        let card = null;;
        if (CARD_POOL.length) {
            for (var k = 0; k < CARD_POOL.length; k++) {
                if (CARD_POOL[k] instanceof CLASSES[entityData.type]) {
                    card = CARD_POOL[k];
                    CARD_POOL.splice(k, 1);
                    break;
                }
            }
        }
        if (!card && entityData) {
            card = new CLASSES[entityData.type](this)
        }

        card.life = entityData.life || 0;
        card.resetCard();

        card.pos.i = i;
        card.pos.j = j;
        // card.resize();
        card.x = i * CARD.width;
        card.y = j * CARD.height - CARD.height;
        // card.cardContainer.scale.set(1.2 - j * 0.05)
        if (entityData.type == 'Block') {
            card.visible = false;

            console.log(this.grid.slots);
            this.grid.grid[i][j].visible = false;
        }
        card.alpha = 0;
        TweenLite.to(card, 0.5, {
            alpha: 1,
            delay: i * 0.05,
            y: j * CARD.height,
            ease: Back.easeOut
        })
        card.updateCard();
        this.board.addCard(card);
        this.cardsContainer.addChild(card);
        return card;
    }
    placeNewLine(lineID = 0) {
        for (var i = 0; i < GRID.i; i++) {
            let entityData = {
                type: 'Piece',
                life: ENEMIES.list[Math.floor(Math.random() * 2)].life
            }
            this.placeCard(i, lineID, entityData);
            // this.cardsContainer.addChild(this.placeCard(i, lineID, entityData));
        }
    }
    update(delta) {
        // if (renderer.plugins.interaction.mouse.global) {
        //     this.mousePosition = renderer.plugins.interaction.mouse.global;
        // }
        // this.updateMousePosition();

        for (var i = this.particlesList.length - 1; i >= 0; i--) {
            if (this.particlesList[i].dead) {
                GAME_PARTICLES_POOL.push(this.particlesList[i]);
                this.particlesList.splice(i, 1);
            } else {
                this.particlesList[i].update(delta)
            }
        }
        for (var i = 0; i < this.particlesList.length; i++) {
            this.particlesList[i].update(delta)
        }

        this.gridContainer.y = this.initGridY + Math.sin(this.initGridAcc) * 2;
        this.initGridAcc += 0.05;

        if (this.board) {
            this.board.update(delta);
        }
    }

    updateMousePosition() {
        if (!this.currentCard || !this.gameStarted) {
            return;
        }

        this.mousePosID = Math.floor((this.mousePosition.x - this.gridContainer.x) / CARD.width);
        // this.trailMarker.alpha = 0;
        this.trailMarker.y = this.currentCard.y + CARD.height
        if (this.mousePosID >= 0 && this.mousePosID < GRID.i) {
            TweenLite.to(this.trailMarker, 0.1, {
                x: this.mousePosID * (CARD.width) + CARD.width / 2
            });
            this.trailMarker.alpha = 0.95;
            if (this.currentCard) {
                if (this.mousePosID * CARD.width >= 0) {
                    // console.log("MOUSE MOVE");
                    this.currentCard.moveX(this.mousePosID * CARD.width, 0.1);
                }
            }
        }
    }

    onMouseMove(e) {
        this.mousePosition = e.data.global;
        this.updateMousePosition();
    }
    onTapUp(e) {
        // console.log(e);
        if (!this.currentCard || !this.gameStarted) {
            return;
        }
        if (e.data) {
            this.mousePosition = e.data.global
        } else {
            this.mousePosition = renderer.plugins.interaction.mouse.global
        }
        if (this.mousePosition.y < this.gridContainer.y) {
            return;
        }
        this.updateMousePosition();
        //console.log(renderer.plugins.interaction.activeInteractionData[0].global);
        if (!this.board.isPossibleShot(this.mousePosID)) {
            return;
        }

        this.gameplayData.currentRound++;
        this.board.reserBoardStats();



        let nextRoundTimer = this.board.shootCard(this.mousePosID, this.currentCard);

        // this.screenManager.moveStarsVertical(0.01);


        TweenLite.to(this.trailMarker, 0.2, {
            alpha: 0
        });
        let normalDist = (this.currentCard.y - this.currentCard.pos.j * CARD.height) / GRID.height;
        this.currentCard.move({
            x: this.currentCard.pos.i * CARD.width,
            y: this.currentCard.pos.j * CARD.height
        }, 0.1 * normalDist);

        this.currentCard = null;
        this.updateUI();
        // console.log(0.1 * normalDist * 100);

        if (false && this.gameplayData.currentRound % this.levelProgression[this.currentLevelProgression] == 0) {
            this.currentLevelProgression++;
            if (this.currentLevelProgression >= this.levelProgression.length) {
                // this.currentLevelProgression %= this.levelProgression.length
                this.currentLevelProgression = this.levelProgression.length - 1;
            }
            setTimeout(function() {
                if (this.board.addNewLine()) {
                    this.gameOver();
                    return;
                }
                this.placeNewLine();
                this.newRound();
            }.bind(this), 0.1 * normalDist + nextRoundTimer + 0.5);
        } else {
            setTimeout(function() {
                let posShoot = this.board.posShootUpdate();
                setTimeout(function() {
                    if (posShoot.isGameOver) {
                        this.gameOver();
                        return;
                    }
                    if (this.board.testEndLevel()) {
                        this.startNewLevel();
                        return;
                    }
                    if (this.board.testSkullKilled()) {
                        if (this.board.addNewLine()) {
                            this.gameOver();
                            return;
                        }
                        this.placeNewLine();
                    }

                    if (this.board.testGameOver()) {
                        this.gameOver();
                        return;
                    }
                    this.newRound();
                }.bind(this), posShoot.time);

            }.bind(this), 0.1 * normalDist + nextRoundTimer);
        }

        // console.log(nextRoundTimer);
    }

    startNewLevel() {

        this.levelWin();

    }
    resetUI() {

    }
    killGame() {

        console.log('KILLING GAME? ');
        this.gameStarted = false;
        let timeToDestroy = this.board.forceKillAllEnemies();

        //this.resetUI();

        // this.grid.destroyGrid();

        if (this.currentCard) {
            this.currentCard.forceDestroy();
            this.trailMarker.alpha = 0;
        }
        for (var i = this.cardQueue.length - 1; i >= 0; i--) {
            this.cardQueue[i].forceDestroy();
        }
        this.cardQueue = [];
        if (this.inGameHUD && this.inGameHUD.parent) {
            this.inGameHUD.parent.removeChild(this.inGameHUD);
        }
        this.inGameHUD = null;
    }
    debugGameover(fail = false) {
        this.gameStarted = false;

        let firstDestroyTimer = this.board.destroyAllBombs();
        let secondDestroyTimer = 0;
        let thirdDestroyTimer = 0;
        let totBombs = 0;
        setTimeout(function() {
            totBombs = Math.ceil(this.gameplayData.getRoundsToDie() * 0.1);
            totBombs = totBombs > 5 ? 5 : totBombs;
            if (fail) totBombs = 0;
            secondDestroyTimer = this.board.addFinalBombs(totBombs);
            this.inGameHUD.resetRoundsCounter(this.gameplayData.clone(), secondDestroyTimer / 1000);
            setTimeout(function() {
                thirdDestroyTimer = this.board.destroyAllBombs(200);
                setTimeout(function() {
                    let alphaTimer = this.board.destroyAllEnemies(false);
                    let fadeGridTimer = alphaTimer / 1000 * 0.5
                    let diff = (alphaTimer / 1000) - fadeGridTimer
                    this.grid.fadeOut(alphaTimer / 1000, diff / this.grid.slots.length, true);
                    this.inGameHUD.showGameOver(this.gameplayData, alphaTimer / 1000);
                    // TweenLite.to(this.grid, alphaTimer/1000*1.1, {alpha:0});
                    // this.grid.alpha = 0
                }.bind(this), thirdDestroyTimer);
            }.bind(this), secondDestroyTimer);
        }.bind(this), firstDestroyTimer);

        if (this.currentCard) {
            this.currentCard.destroy();
            this.trailMarker.alpha = 0;
        }
        for (var i = this.cardQueue.length - 1; i >= 0; i--) {
            this.cardQueue[i].destroy();
        }
        this.cardQueue = [];
    }
    levelWin() {
        this.debugGameover();
    }
    gameOver() {

        this.debugGameover(true);
        return
        this
    }

    gameOverRedirect() {
        this.gameStarted = false;
        let timeToDestroy = this.board.destroyAllEnemies();

        this.grid.destroyGrid();

        setTimeout(function() {
            this.resetUI();
        }.bind(this), timeToDestroy);
        for (var i = this.cardQueue.length - 1; i >= 0; i--) {
            this.cardQueue[i].forceDestroy();
        }
        this.cardQueue = [];
        this.redirectToInit()

    }


    onTapDown(e) {
        if (!this.currentCard || !this.gameStarted) {
            return;
        }
        if (e.data) {
            this.mousePosition = e.data.global
        } else {
            // this.mousePosition = renderer.plugins.interaction.mouse.global
        }
        this.updateMousePosition();
    }

    transitionOut(nextScreen) {
        this.killGame();
        this.removeEvents();
        // TweenLite.to(this.gameContainer, 1.5, {
        //     y: -config.height
        // })
        this.grid.fadeOut(0, 0)
            //super.transitionOut(nextScreen);
        this.nextScreen = nextScreen;
        setTimeout(function() {
            this.endTransitionOut();
        }.bind(this), 0);
    }
    transitionIn() {
        this.gameContainer.y = 0;

        super.transitionIn();
    }
    destroy() {

    }

    removeEvents() {
        this.gameContainer.interactive = false;

        console.log('REMOVE VJOJAODKAS ODKASODJ');
        // myObject.stopped.removeAll();
        this.screenManager.topMenu.onBackClick.removeAll();
        this.gameContainer.off('mousemove', this.onMouseMove.bind(this));
        this.gameContainer.off('mousedown', this.onTapDown.bind(this)).off('touchstart', this.onTapDown.bind(this));
        this.gameContainer.off('mouseup', this.onTapUp.bind(this)).off('touchend', this.onTapUp.bind(this));
    }
    addEvents() {
        this.removeEvents();
        console.log('ADD VJOJAODKAS ODKASODJ');
        this.screenManager.topMenu.onBackClick.add(this.redirectToInit.bind(this));
        this.gameContainer.interactive = true;
        this.gameContainer.on('mousemove', this.onMouseMove.bind(this));
        this.gameContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
        this.gameContainer.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this));

    }


}