import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import UIList from './uiElements/UIList';
import HUDActionContainer from './HUDActionContainer';
export default class HUDActionsList extends UIList {
    constructor(rect) {
        super();

        this.itensList = [];
        this.w = rect.w
        this.h = rect.h
        this.onStartAction = new Signals();
        this.onFinishAction = new Signals();

        this.containerBackground = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, rect.w, rect.h);
        this.addChild(this.containerBackground)
        this.containerBackground.alpha = 0;

        for (var i = 0; i < GAME_DATA.actionsData.length; i++) {
            let data = GAME_DATA.actionsData[i];
            let item = new HUDActionContainer(GAME_DATA.actionsData[data.id]);
            this.addChild(item);
            // item.setTexture('spaceship');
            // item.y = 80 * i
            item.fitWidth = 1;
            item.onClickItem.add(this.onStartActionCallback.bind(this))
            item.onFinishAction.add(this.onFinishActionCallback.bind(this))
            this.itensList.push(item);
            this.elementsList.push(item);
            // break
        }
        this.updateData();
        this.updateVerticalList();
        // console.log( this.elementsList);
        // this.updateHorizontalList(); GAME_DATA.actionsDataStatic[i]
    }
    updateActionList() {
    	console.log('updateActionList');
    	this.updateData();
    	for (var i = 0; i < this.itensList.length; i++) {
            console.log(GAME_DATA.actionsData[i]);
    		this.itensList[i].updateData(GAME_DATA.actionsData[i]);
    	}
    }
    updateData() {
    	// if(GAME_DATA.sessionData.tokens <= 0){
    	// 	this.tokenPrice.alpha = 0;
    	// }else{
    	// 	this.tokenPrice.alpha = 1;
    	// }
        // this.priceLabel.text = GAME_DATA.sessionData.tokens;
        // this.priceLabel.pivot.x = this.priceLabel.width / 2;
        // this.priceLabel.pivot.y = this.priceLabel.height / 2;
    }
    killAllActions() {
        for (var i = this.itensList.length - 1; i >= 0; i--) {
            this.itensList[i].reset()
        }
    }

    onClick() {
        this.onClickItem.dispatch(this);
    }
    onStartActionCallback(action) {
        console.log(action.level);
        this.onStartAction.dispatch(GAME_DATA.actionsDataStatic[action.id]);
    }
    onFinishActionCallback(action) {
        this.onFinishAction.dispatch(GAME_DATA.actionsDataStatic[action.id]);
    }
    hide(force) {
    	this.updateVerticalList();
    	for (var i = 0; i < this.elementsList.length; i++) {
    		// TweenLite.to(this.elementsList[i], 0.5, { x:this.elementsList.x + this.elementsList.height + 20});
    		TweenLite.to(this.elementsList[i], force?0:0.2, {delay:0.1 * i , x:this.elementsList[i].x + this.elementsList[i].width + 20, ease:Back.easeIn});
    	}
        // this.visible = false;
    }
    show() {
    	this.visible = true;
    	this.updateVerticalList();
    	for (var i = 0; i < this.elementsList.length; i++) {
    		TweenLite.from(this.elementsList[i], 0.3, {delay:0.2 * i + 0.5, x:this.elementsList[i].x + this.elementsList[i].width + 20, ease:Back.easeOut});
    	}
        this.updateActionList();
        // this.visible = true;
    }
    update(delta) {
        // this.tokenSin += delta * 2;
        // this.tokenSin %= Math.PI * 2;
        // this.spriteToken.rotation = Math.sin(this.tokenSin) * -0.1
        // this.spriteToken.y = Math.cos(this.tokenSin) * 5
        for (var i = this.itensList.length - 1; i >= 0; i--) {
            this.itensList[i].update(delta);
        }
    }
}