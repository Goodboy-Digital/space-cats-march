import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class ChestContainer extends PIXI.Container
{
    constructor()
    {
        super();
        this.onConfirm = new Signals();
        this.container = new PIXI.Container();
        this.chestSin = 0;

        this.chestBubble = new PIXI.Sprite.from('pickup_bubble');
        this.chestBubble.anchor.set(0.5, 0.5);

        let chestIcon = new PIXI.Sprite.from('treasure_chest');
        chestIcon.anchor.set(0.5, 0.5);
        chestIcon.scale.set(this.chestBubble.width / chestIcon.width * 0.65);
        // chestIcon.blendMode = PIXI.BLEND_MODES.ADD
        // chestIcon.alpha= 0.25
        // chestIcon.y = -this.chestBubble.height * 0.15;

        this.quantchest = new PIXI.Text('Open a free\nchest!\n35:05',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        // chestIcon.x = -this.chestBubble.width * 0.15;

        this.quantchest.pivot.x = this.quantchest.width / 2;
        this.quantchest.pivot.y = this.quantchest.height / 2;
        // this.quantchest.y = -15;
        // this.currentPointsLabel.pivot.y = this.currentPointsLabel.height / 2;

        this.container.addChild(chestIcon);
        this.container.addChild(this.quantchest);
        // this.container.addChild(this.chestBubble);
        this.addChild(this.container)
        this.containerScale = config.width / this.container.width * 0.15
        this.container.scale.set(this.containerScale)

        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.on('mousedown', this.onChestClick.bind(this)).on('touchstart', this.onChestClick.bind(this));
        //this.actualTime = 

        this.updateTimer();
        this.timerInterval = setInterval(()=>{
        	this.now = new Date().getTime();
        	this.updateTimer();
        }, 1000);
        
    }
    activeContainer(){
    	this.quantchest.text = 'OPEN YOUR \nPRIZE'
    	this.quantchest.pivot.x = this.quantchest.width / 2;
        this.quantchest.pivot.y = this.quantchest.height / 2;
        this.quantchest.y = - this.chestBubble.height / 2 //- this.quantchest.height / 4

    	TweenLite.to(this.container.scale, 0.75, {x:this.containerScale, y:this.containerScale, ease:Elastic.easeOut})
    }
    updateTimer(){
    // 	let distance = this.countDownDate - this.now;
    	this.container.scale.set(this.containerScale * 0.75)
  		let now = new Date();

  		let distance = GAME_DATA.chestData.chestTime - (now - GAME_DATA.chestData.lastChestTime)
    	// console.log(GAME_DATA.chestData.chestTime, distance);
    	let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  		let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    	// console.log(minutes, seconds);
  		if(minutes <= 0 && seconds <= 0){
  			clearInterval(this.timerInterval);
  			this.activeContainer();
  			return
  		}
  		if(seconds < 10){
  			seconds = '0'+seconds;
  		}
  		if(minutes < 10){
  			minutes = '0'+minutes;
  		}
    	this.quantchest.text = 'FREE CHEST IN\n'+minutes + ':' + seconds
    	this.quantchest.pivot.x = this.quantchest.width / 2;
        this.quantchest.pivot.y = this.quantchest.height / 2;
        this.quantchest.y = - this.chestBubble.height / 2 //- this.quantchest.height / 4

    	// this.quantchest.text = dist.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
    	// this.quantchest.text = GAME_DATA.chestData.lastChestTime.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
    }
    onChestClick(){
    	this.onConfirm.dispatch();

    	GAME_DATA.chestData.lastChestTime = new Date();
    	this.updateTimer();
    	clearInterval(this.timerInterval);
        this.timerInterval = setInterval(()=>{
        	this.now = new Date().getTime();
        	this.updateTimer();
        }, 1000);
    }
    update(delta)
    {	
    	
    	this.chestSin += 0.05
        this.chestSin %= Math.PI * 2;
        // this.container.rotation = Math.sin(this.chestSin) * 0.1 + 0.2
        this.quantchest.rotation = -this.container.rotation
        this.container.scale.set(this.containerScale + Math.sin(this.chestSin) * 0.01, this.containerScale + Math.cos(this.chestSin) * 0.01)
    }
}