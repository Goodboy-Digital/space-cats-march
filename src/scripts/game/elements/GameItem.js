import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import Signals from 'signals';
export default class GameItem extends PIXI.Container
{
    constructor()
    {

        super();


        this.w = PAWN.width * 3;
        this.sin = 0;
        this.animationSpeed = 0.01;
        this.animationTimer = 0;

        this.sprite = new PIXI.Sprite.from('pickup_bubble');
        this.sprite.anchor.set(0.5, 0.5);

        this.container = new PIXI.Container();

        this.standardScale = this.w / this.sprite.width;
        this.container.scale.set(this.standardScale);


        // this.sprite.alpha = 0;
        this.noScalable = false;

        this.pickupsSprites = ['pickup_fish', 'pickup_mouse', 'pickup_octopus']
        this.spriteItem = new PIXI.Sprite.from('pickup_fish');
        this.spriteItem.anchor.set(0.5, 0.5);

        this.generalSpeed = 5;

        this.container.addChild(this.spriteItem);
        this.container.addChild(this.sprite);
        this.addChild(this.container);
        this.interactive = true;
        this.buttonMode = true;
        this.on('mousedown', this.collect.bind(this)).on('touchstart', this.collect.bind(this));

        this.dist = config.width * 0.025 // - this.w / 2;

        this.onCollect = new Signals();
    }
    collect()
    {
    	if(this.collecting){
    		return
    	}
        this.onCollect.dispatch(this);
        this.collected();
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    reset(pos, type = 0)
    {
        this.itemType = type;
        this.currentTexture = this.pickupsSprites[type];
        this.spriteItem.texture = PIXI.Texture.from(this.pickupsSprites[type]);
        this.startPos = pos;
        this.x = pos.x;
        this.y = pos.y;
        this.velocity = {
            x: 0,
            y: -config.height * 0.25
        }
        this.kill = false;
        this.collecting = false;
        this.sprite.scale.set(1);
        this.spriteItem.scale.set(1);
        this.container.alpha = 1;
    }
    collected()
    {
        this.collecting = true;
        this.sprite.scale.set(0.5);
        TweenLite.to(this.sprite.scale, 0.5,
        {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        })

        this.spriteItem.scale.set(0.5);
        TweenLite.to(this.spriteItem.scale, 0.75,
        {
            x: 1.2,
            y: 1.2,
            ease: Elastic.easeOut
        })

        TweenLite.to(this.container, 0.25,
        {
        	alpha:0,
        	delay:0.75
        })
    }
    update(delta)
    {
        if (this.collecting)
        {
            return;
        }
        this.y += this.velocity.y * delta;
        this.x = this.startPos.x + Math.sin(this.sin) * this.dist;
        this.rotation = Math.sin(this.sin) * 0.2
        this.spriteItem.rotation = - this.rotation - Math.cos(this.sin) * 0.2
        this.sin += 0.1;
        if (this.y < -PAWN.height)
        {
            this.kill = true;
        }
    }


}