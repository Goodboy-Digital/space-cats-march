import * as PIXI from 'pixi.js';
import utils from '../../../utils';
import CircleMask from '../../effects/CircleMask';
export default class CircleCounter extends PIXI.Container {
    constructor(maskRadius = 30, shapeRadius = 20) {
        super();

        this.circleMask = new CircleMask();

        this.addChild(this.circleMask);

        this.current = 0;
        this.max = 1;

        this.frontShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, shapeRadius);
        this.maskedShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, maskRadius);
        this.addChild(this.maskedShape, this.frontShape);

        this.maskedShape.mask = this.circleMask;

        this.update(0);
    }
    build(maskColor = 0xFFFFFF, frontColor = 0x0084c9) {
        this.maskedShape.tint = maskColor;
        this.frontShape.tint = frontColor;
    }
    update(value) {
        this.current = value;
        let ratio = this.current / this.max;
        TweenLite.to(this.circleMask, 0.5, {ratio: 1 - ratio, ease:Back.easeOut});
        // this.circleMask.ratio = 1 - ratio;
    }
}