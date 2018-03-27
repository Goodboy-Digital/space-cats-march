import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import CatItem from './CatItem';
export default class CatItemList extends PIXI.Container
{
    constructor(rect = {
        w: 500,
        h: 500
    }, itensPerPage = 3)
    {
        super();
        this.onAutoCollect = new Signals();
        this.container = new PIXI.Container();
        this.catListContainer = new PIXI.Container();
        this.containerBackground = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, rect.w, rect.h);
        this.addChild(this.containerBackground)
        this.containerBackground.alpha = 0;
        this.maskGraphic = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, rect.w, rect.h);
        this.addChild(this.maskGraphic)
        this.catsItemList = [];
        this.rect = rect;
        this.itemsPerPage = itensPerPage;
        this.itemHeight = this.rect.h / this.itemsPerPage;
        for (var i = 0; i < GAME_DATA.catsData.length; i++)
        {
            let catItem = new CatItem(GAME_DATA.catsData[i],
            {
                w: this.rect.w,
                h: this.itemHeight
            });
            catItem.onAutoCollect.add(this.onAutoCollectCallback.bind(this));
            this.catListContainer.addChild(catItem)
            catItem.y = this.itemHeight * i;
            this.catsItemList.push(catItem);

        }
        this.container.addChild(this.catListContainer);
        this.container.addChild(this.containerBackground);
        this.addChild(this.container);
        this.container.mask = this.maskGraphic;
        this.container.interactive = true;

        this.container.on('mousemove', this.moveDrag.bind(this))
            .on('touchmove', this.moveDrag.bind(this))

        this.container.on('mousedown', this.startDrag.bind(this))
            .on('touchstart', this.startDrag.bind(this));

        this.container.on('mouseup', this.endDrag.bind(this))
            .on('touchend', this.endDrag.bind(this))
            .on('touchendoutside', this.endDrag.bind(this))
            .on('mouseupoutside', this.endDrag.bind(this));

        // this.addChild(this.container);
        this.updateAllItens();
    }
    onAutoCollectCallback(cat)
    {
        this.onAutoCollect.dispatch(cat);
    }
    updateAllItens()
    {
        for (var i = 0; i < this.catsItemList.length; i++)
        {
            this.catsItemList[i].updateItem(GAME_DATA.catsData[i])
        }
    }
    endDrag()
    {
        this.dragging = false;
        this.containerBackground.interactive = false;

        let target = 0;
        let targY = this.catListContainer.y
        let maxH = this.itemHeight * this.catsItemList.length;
        if (this.goingDown == 1)
        {
            targY -= this.itemHeight / 2;
            target = Math.floor(targY / this.itemHeight) * this.itemHeight
        }
        else if (this.goingDown == -1)
        {

            targY += this.itemHeight / 2;
            target = Math.ceil(targY / this.itemHeight) * this.itemHeight
        }

        // target = targY
        if (target > 0)
        {
            target = 0;
        }


        if (target > 0)
        {
            TweenLite.to(this.catListContainer, 0.75,
            {
                y: 0,
                ease: Back.easeOut
            })
        }
        else if (target + maxH < this.containerBackground.height)
        {
            console.log(maxH - this.containerBackground.height);
            TweenLite.to(this.catListContainer, 0.75,
            {
                y: this.containerBackground.height - maxH, // - this.catListContainer.height,
                ease: Back.easeOut
            })
        }
        else
        {
            console.log('target', target);
            TweenLite.to(this.catListContainer, 0.75,
            {
                y: target,
                ease: Back.easeOut
            })
        }
    }
    moveDrag(e)
    {
        if (this.dragging)
        {

            this.dragVelocity = {
                x: (e.data.global.x - this.currentMousePos.x),
                y: this.currentMousePos.y - e.data.global.y
            }
            this.currentMousePos = {
                x: e.data.global.x,
                y: e.data.global.y
            };

            this.catListContainer.y -= this.dragVelocity.y

            if (this.dragVelocity.y > 0)
            {
                this.containerBackground.interactive = true;
                this.goingDown = 1;
            }
            else if (this.dragVelocity.y < 0)
            {
                this.containerBackground.interactive = true;
                this.goingDown = -1;
            }
        }
    }
    startDrag(e)
    {

        this.goingDown = 0;
        TweenLite.killTweensOf(this.catListContainer);
        this.dragging = true;
        this.currentMousePos = {
            x: e.data.global.x,
            y: e.data.global.y
        };
    }
}