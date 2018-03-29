import * as PIXI from 'pixi.js';
export default class StaticCat extends PIXI.Container
{
    constructor()
    {
        super();
        this.elementsList = [];
        this.animationContainer = new PIXI.Container();
        this.addChild(this.animationContainer)

        this.bodySin = 0;

        this.currentCatLabel = 'cat_orange_'
        this.zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 10);

        this.head = new PIXI.Sprite.from(this.currentCatLabel + 'head');
        this.head.anchor.set(0.5, 0.9)

        this.body = new PIXI.Sprite.from(this.currentCatLabel + 'belly');
        this.body.anchor.set(0.5, 0.65)
        this.body.y = this.body.height * 0.5

        this.armsRot = Math.PI * 0.3


        this.rarm = new PIXI.Sprite.from(this.currentCatLabel + 'arm');
        this.rarm.anchor.set(0.5, 0.1)
        this.rarm.rotation = this.armsRot
        this.rarm.x = -this.body.width * this.body.anchor.x + this.rarm.width * this.rarm.anchor.x;


        this.larm = new PIXI.Sprite.from(this.currentCatLabel + 'arm');
        this.larm.anchor.set(0.5, 0.1)
        this.larm.rotation = -this.armsRot
        this.larm.x = this.body.width * this.body.anchor.x - this.larm.width * this.larm.anchor.x;


        this.rleg = new PIXI.Sprite.from(this.currentCatLabel + 'leg');
        this.rleg.anchor.set(0.5, 0.25)
            // this.rleg.rotation = Math.PI * 0.2
        this.rleg.x = -this.body.width * this.body.anchor.x + this.rleg.width * this.rleg.anchor.x;
        this.rleg.y = this.body.height * this.body.anchor.y //- this.lleg.height * this.lleg.anchor.y;


        this.lleg = new PIXI.Sprite.from(this.currentCatLabel + 'leg');
        this.lleg.anchor.set(0.5, 0.25)
            // this.lleg.rotation = -Math.PI * 0.2
        this.lleg.x = this.body.width * this.body.anchor.x - this.lleg.width * this.lleg.anchor.x;
        this.lleg.y = this.body.height * this.body.anchor.y //- this.lleg.height * this.lleg.anchor.y;



        this.animationContainer.addChild(this.lleg);
        this.animationContainer.addChild(this.rleg);
        this.animationContainer.addChild(this.rarm);
        this.animationContainer.addChild(this.larm);
        this.animationContainer.addChild(this.body);
        this.animationContainer.addChild(this.head);
        // this.animationContainer.addChild(this.zero)

        this.animationContainer.y = -this.animationContainer.height * 0.5

    }
    unlock()
    {
        this.lleg.tint = 0xFFFFFF;
        this.rleg.tint = 0xFFFFFF;
        this.larm.tint = 0xFFFFFF;
        this.rarm.tint = 0xFFFFFF;
        this.body.tint = 0xFFFFFF;
        this.head.tint = 0xFFFFFF;
    }
    lock()
    {
    	this.updateCatTextures('white_');
        this.lleg.tint = 0xE5519B;
        this.rleg.tint = 0xE5519B;
        this.larm.tint = 0xE5519B;
        this.rarm.tint = 0xE5519B;
        this.body.tint = 0xE5519B;
        this.head.tint = 0xE5519B;

    }
    updateCatTextures(src)
    {
        this.currentCatLabel = src;
        this.lleg.texture = new PIXI.Texture.from(this.currentCatLabel + 'leg');
        this.rleg.texture = new PIXI.Texture.from(this.currentCatLabel + 'leg');
        this.larm.texture = new PIXI.Texture.from(this.currentCatLabel + 'arm');
        this.rarm.texture = new PIXI.Texture.from(this.currentCatLabel + 'arm');
        this.body.texture = new PIXI.Texture.from(this.currentCatLabel + 'belly');
        this.head.texture = new PIXI.Texture.from(this.currentCatLabel + 'head');
    }
}