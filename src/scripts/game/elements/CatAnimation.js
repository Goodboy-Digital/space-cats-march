import * as PIXI from 'pixi.js';
export default class CatAnimation extends PIXI.Container
{
    constructor()
    {
        super();
        this.elementsList = [];
        this.head = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,50);
        this.animationContainer = new PIXI.Container();
        this.animationContainer.addChild(this.head);

        this.addChild(this.animationContainer)
    }
}