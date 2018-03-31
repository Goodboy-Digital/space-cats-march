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

        this.tokensContainer = new PIXI.Container();

        this.tokenPrice = new PIXI.Sprite.from('token_quant');
        this.tokenPrice.anchor.set(0.5);
        this.tokenPrice.scale.set(0.85);
        this.priceLabel = new PIXI.Text(GAME_DATA.sessionData.tokens, {
            fontFamily: 'blogger_sansregular',
            fontSize: '32px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.tokenPrice.addChild(this.priceLabel)


        this.spriteToken = new PIXI.Sprite.from(GAME_DATA.gameTokens.icon);
        this.spriteToken.anchor.set(0.5, 0);
        this.spriteToken.x = this.spriteToken.width / 2;
        this.spriteToken.y = this.spriteToken.height / 2;
        this.tokenPrice.x = this.spriteToken.x + this.spriteToken.width / 2;
        let tokenBackground = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, this.spriteToken.width, this.spriteToken.height);
        this.tokensContainer.addChild(tokenBackground)
            tokenBackground.alpha = 0;
        this.spriteToken.scale.set(0.75);

        this.tokenSin = 0;
        this.tokensContainer.addChild(this.spriteToken);
        this.tokenPrice.addChild(this.priceLabel);
        this.tokensContainer.addChild(this.tokenPrice);

        this.addChild(this.tokensContainer);
        this.elementsList.push(this.tokensContainer);
        this.tokensContainer.listScl = 0.07;
        this.tokensContainer.fitWidth = 1;

        //     quant:1,
        //     icon: 'pickup_fish',
        // }
        // console.log(this.w, this.h);
        for (var i = 0; i < GAME_DATA.actionsData.length; i++) {
            let data = GAME_DATA.actionsData[i];
            let item = new HUDActionContainer(GAME_DATA.actionsData[i]);
            this.addChild(item);
            // item.setTexture('spaceship');
            // item.y = 80 * i
            item.fitWidth = 1;
            item.onClickItem.add(this.onStartActionCallback.bind(this))
            item.onFinishAction.add(this.onFinishActionCallback.bind(this))
            this.itensList.push(item);
            this.elementsList.push(item);
        }
        this.updateData();
        this.updateVerticalList();
        // console.log( this.elementsList);
        // this.updateHorizontalList();
    }
    updateActionList() {
    	this.updateData();
    	for (var i = 0; i < this.itensList.length; i++) {
    		this.itensList[i].updateData(GAME_DATA.actionsData[i]);
    	}
    }
    updateData() {
    	if(GAME_DATA.sessionData.tokens <= 0){
    		this.tokenPrice.alpha = 0;
    	}else{
    		this.tokenPrice.alpha = 1;
    	}
        this.priceLabel.text = GAME_DATA.sessionData.tokens;
        this.priceLabel.pivot.x = this.priceLabel.width / 2;
        this.priceLabel.pivot.y = this.priceLabel.height / 2;
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
        this.onStartAction.dispatch(action);
    }
    onFinishActionCallback(action) {
        this.onFinishAction.dispatch(action);
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
        // this.visible = true;
    }
    update(delta) {
        this.tokenSin += delta * 2;
        this.tokenSin %= Math.PI * 2;
        this.spriteToken.rotation = Math.sin(this.tokenSin) * -0.1
        this.spriteToken.y = Math.cos(this.tokenSin) * 5
        for (var i = this.itensList.length - 1; i >= 0; i--) {
            this.itensList[i].update(delta);
        }
    }
}