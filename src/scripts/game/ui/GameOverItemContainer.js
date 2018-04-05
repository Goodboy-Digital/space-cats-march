import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import StaticCat from '../ui/StaticCat';
export default class GameOverItemContainer extends PIXI.Container
{
    constructor(w, h)
    {
        super();
        this.onFinishShow = new Signals();
        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.topBg = new PIXI.Graphics().beginFill(0xFFFFFF * Math.random()).drawRect(0, 0, w, h);
        // this.container.addChild(this.topBg)
        // this.topBg.alpha = 0.5;

        this.itemContainer = new PIXI.Container();
        this.addChild(this.itemContainer);

        this.backTexture = new PIXI.Sprite.from('results_newcat_rays_02');
        this.backTexture.scale.set(this.topBg.width / (this.backTexture.width / this.backTexture.scale.x))
        this.backTexture.anchor.set(0.5);
        this.itemContainer.addChild(this.backTexture)



        this.itemSprite = new PIXI.Sprite.from('results_newcat_rays_02');
        this.itemContainer.addChild(this.itemSprite)
        this.itemSprite.anchor.set(0.5);

        this.itemCat = new StaticCat;
        this.itemContainer.addChild(this.itemCat)
        
        // this.itemSprite.anchor.set(0.5);

        this.itemContainer.x = w / 2
        this.itemContainer.y = h / 2

        this.labelContainer = new PIXI.Container();
        this.addChild(this.labelContainer);
        // this.labelContainer.y = h;

         this.quantLabel = new PIXI.Text('65',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '28px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
         this.labelContainer.addChild(this.quantLabel)
    }
    setCat(src){
    	this.itemSprite.visible = false;
    	this.itemCat.visible = true;
    	this.itemCat.updateCatTextures(src)
        console.log(this.itemCat.height, this.topBg.height);
    	this.itemCatScale = this.topBg.height / (this.itemCat.height / this.itemCat.scale.y) * 0.75
    	this.itemCat.scale.set(this.itemCatScale)
    	this.itemCat.animationContainer.y = 0//this.itemCat.animationContainer.height / 2;
    }
    setTexture(texture)
    {
    	this.itemSprite.visible = true;
    	this.itemCat.visible = false;
        this.itemSprite.texture = PIXI.Texture.from(texture);
        this.itemScale = this.topBg.height / (this.itemSprite.height / this.itemSprite.scale.y) * 0.75
        this.itemSprite.scale.set(this.itemScale)

    }
    setValue(value = 999){
        this.currentQuant = value;
    	this.quantLabel.text = value;
        this.quantLabel.x = this.topBg.width + this.quantLabel.width / 2;
    	this.quantLabel.y = this.topBg.height / 2 - this.quantLabel.height / 2;
    }
    update(delta)
    {
        if (this.visible)
        {
            this.starBackground.rotation += 0.05
        }
    }
    forceHide()
    {
        this.alpha = 0;
    }

    updateQuant(quant, force, delay = 0) {

        if(force){
            this.quantLabel.text = utils.formatPointsLabel(quant / MAX_NUMBER);
            this.quantLabel.x = this.topBg.width + this.quantLabel.width / 2;
            this.currentQuant = quant;
            return;
        }
        if(this.currentTween){
            TweenLite.killTweensOf(this.currentTween);
        }
        let moneyObj = {
            current: this.currentQuant,
            target: quant
        }
        this.currentQuant = quant;
        this.currentTween = TweenLite.to(moneyObj, 1, {
            delay:delay,
            current: quant,
            onUpdateParams:[moneyObj],
            onUpdate: (moneyObj) => {
                this.quantLabel.text = utils.formatPointsLabel(moneyObj.current / MAX_NUMBER);
                this.quantLabel.x = this.topBg.width + this.quantLabel.width / 2;
            },
            onComplete:()=>{                
                this.quantLabel.x = this.topBg.width + this.quantLabel.width / 2;
            }
        })
    }


    show(delay = 0)
    {
        this.itemSprite.scale.set(0);
        TweenLite.to(this.itemSprite.scale, 0.5,
        {
            delay: delay,
            x: this.itemScale,
            y: this.itemScale,
            ease: Back.easeOut
        });
        TweenLite.to(this, 0.5,
        {
            delay: delay,
            alpha: 1
        });
    }
}