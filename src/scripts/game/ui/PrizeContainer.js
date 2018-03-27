import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class PrizeContainer extends PIXI.Container
{
    constructor()
    {
        super();
        this.onHidePrize = new Signals();
        this.prizeContainer = new PIXI.Container();
        this.addChild(this.prizeContainer);
        this.w = config.width/2
        this.h = config.width/2
        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        let prizeBg = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, this.w, this.h) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        prizeBg.pivot.x = prizeBg.width / 2
        prizeBg.pivot.y = prizeBg.height / 2
            // prizeBg.scale.set((this.size / prizeBg.width));
        prizeBg.alpha = 1;
        prizeBg.rotation = Math.PI / 4;
        prizeBg.tint = 0xFFFFFF;
        prizeBg.x = config.width / 2;
        prizeBg.y = config.height / 2;

        let prizeInfo = new PIXI.Text('HERE YOUR PRIZE',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0x000000,
            align: 'center',
            fontWeight: '800'
        });

        prizeInfo.pivot.x = prizeInfo.width / 2;
        prizeInfo.pivot.y = prizeInfo.height / 2;

        prizeInfo.x = config.width / 2;
        prizeInfo.y = config.height / 2;

        this.prizeDark.alpha = 0.3;
        this.prizeContainer.addChild(this.prizeDark)
        this.prizeContainer.addChild(prizeBg)
        this.prizeContainer.addChild(prizeInfo)

        this.prizeDark.interactive = true;
        this.prizeDark.buttonMode = true;
        this.prizeDark.on('mouseup', this.hide.bind(this)).on('touchend', this.hide.bind(this));
        
    }
    hide(){
        this.visible = false;
    }
    show(){
        this.visible = true;
    }
}