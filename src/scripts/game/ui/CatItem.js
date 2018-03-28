import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import AutoCollectButton from './AutoCollectButton';
export default class CatItem extends PIXI.Container
{
    constructor(catData, rect = {
        w: 400,
        h: 80
    })
    {
        super();
        this.onAutoCollect = new Signals();
        this.onActiveCat = new Signals();
        this.catData = catData;
        this.container = new PIXI.Container();
        this.addChild(this.container);
        this.thumbH = 0;
        this.background = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, rect.w, rect.h);
        this.container.addChild(this.background)
        this.background.alpha = 0

        this.w = rect.w;
        this.h = rect.h;

        this.elementsList = [];

        this.totalLabel = new PIXI.Text('0000',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '18px',
            fill: 0xFFFFFF,
            align: 'right',
            fontWeight: '800'
        });
        this.totalLabel.listScl = 0.15;
        this.totalLabel.scaleContent = false;
        this.totalLabel.align = 1;

        this.elementsList.push(this.totalLabel);
        this.container.addChild(this.totalLabel)

        this.thumb = new PIXI.Sprite.from(this.catData.catThumb);
        this.thumb.listScl = 0.2;
        this.thumb.scaleContent = false;
        this.thumb.fitHeight = 0.65;
        this.elementsList.push(this.thumb);
        this.container.addChild(this.thumb);
        this.thumbH = this.thumb.height;


        this.plusIcon = new PIXI.Sprite.from('results_arrow');
        this.plusIcon.listScl = 0.065;
        this.plusIcon.fitWidth = 0.65;
        this.plusIcon.scaleContent = true;
        this.plusIcon.align = 0.75;
        this.elementsList.push(this.plusIcon);
        this.container.addChild(this.plusIcon);
        // this.plusIcon.scale.set(this.thumbH / this.plusIcon.height * 0.25)


        this.bonusLabel = new PIXI.Text(this.catData.collectedMultiplier.toFixed(3) + '%',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '14px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.bonusLabel.listScl = 0.1;
        this.bonusLabel.scaleContentMax = true;
        this.bonusLabel.align = 0;
        this.elementsList.push(this.bonusLabel);
        this.container.addChild(this.bonusLabel);

        this.activeButtonContainer = new PIXI.Container();
        this.backButton = new PIXI.Sprite.from('back_button');
        this.catNameLabel = new PIXI.Text('',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '14px',
            // fill: 0,
            fill: 0xe5519b,
            align: 'center',
            fontWeight: '800'
        });
        this.activeButtonContainer.scaleContentMax = true;
        this.activeButtonContainer.addChild(this.backButton);
        this.activeButtonContainer.addChild(this.catNameLabel);


        this.elementsList.push(this.activeButtonContainer);
        this.container.addChild(this.activeButtonContainer)


        this.autocollect = new AutoCollectButton(this.catData)
        this.autocollect.scaleContent = false;
        this.autocollect.fitWidth = 1;
        this.autocollect.align = 1;
        this.autocollect.enableAutoCollect.add(this.onAutoCollectCallback.bind(this));
        this.elementsList.push(this.autocollect);
        this.container.addChild(this.autocollect);
    }
    activeCat(){
        this.onActiveCat.dispatch(this.catData);
    }
    onAutoCollectCallback()
    {
        this.onAutoCollect.dispatch(this.catData);
    }
    updateItem(catData)
    {
        this.catData = catData;
        let quant = utils.formatPointsLabel(this.catData.collected / MAX_NUMBER);

        this.totalLabel.text = quant == 0 ? '' : quant
        this.bonusLabel.text = utils.cleanString(this.catData.collectedMultiplier.toFixed(2)) + '%';

        if (this.catData.canBeActive && !this.catData.active)
        {
            this.thumb.texture = PIXI.Texture.from('results_locked_cat');
            this.totalLabel.text = ''
            this.catNameLabel.text = ('active').toUpperCase();
            this.plusIcon.texture = PIXI.Texture.from('results_lock');
            this.autocollect.visible = false;
            this.backButton.alpha = 1;
            this.backButton.tint = 0x6250e5
            this.catNameLabel.style.fill = 0xFFFFFF;
            this.bonusLabel.visible = false;
            this.plusIcon.visible = false;
            this.backButton.interactive = true;
            this.backButton.buttonMode = true;
            this.backButton.on('mouseup', this.activeCat.bind(this)).on('touchend', this.activeCat.bind(this));

        }
        else if (this.catData.active)
        {
            this.backButton.off('mouseup', this.activeCat.bind(this)).off('touchend', this.activeCat.bind(this));
            this.thumb.tint = 0xFFFFFF;
            this.thumb.texture = PIXI.Texture.from(this.catData.catThumb);
            this.catNameLabel.text = this.catData.catName.toUpperCase();
            this.plusIcon.texture = PIXI.Texture.from('results_arrow');
            this.catNameLabel.style.fill = 0xFFFFFF;
            this.bonusLabel.visible = true;
            this.plusIcon.visible = true;

            this.backButton.alpha = 0;
            this.autocollect.visible = true;
            if (this.catData.collected >= this.catData.amountToAutoCollect)
            {

            }
            else
            {
                // this.autocollect.visible = false;
            }

            if (this.catData.isAuto)
            {
                this.autocollect.enable();
            }
            else
            {
                this.autocollect.reset(this.catData);
            }
            // this.autocollect.x = this.catNameLabel.x + this.catNameLabel.width + 25
        }else{
            this.backButton.off('mouseup', this.activeCat.bind(this)).off('touchend', this.activeCat.bind(this));
            this.thumb.texture = PIXI.Texture.from('results_locked_cat');
            this.totalLabel.text = ''
            this.catNameLabel.text = ('unlock at\n' + utils.formatPointsLabel(this.catData.require / MAX_NUMBER)).toUpperCase();
            this.plusIcon.texture = PIXI.Texture.from('results_lock');
            this.autocollect.visible = false;
            this.bonusLabel.visible = false;
            this.plusIcon.visible = false;
            this.backButton.alpha = 1;
            this.catNameLabel.style.fill = 0xe5519b;
        }


        console.log(this.catNameLabel.width, this.backButton.width);
        let realSize = {
            w: this.catNameLabel.width / this.catNameLabel.scale.x,
            h: this.catNameLabel.height / this.catNameLabel.scale.y
        }
        this.catNameLabel.scale.set(this.backButton.width / realSize.w * 0.7)

        this.catNameLabel.pivot.x = realSize.w / 2;
        this.catNameLabel.pivot.y = realSize.h / 2;

        this.catNameLabel.x = this.backButton.width / 2;
        this.catNameLabel.y = this.backButton.height / 2;

        this.autocollect.updateData(catData);

        this.updateHorizontalList();
    }
    updateHorizontalList()
    {
        let listSizes = [];
        let sum = 0;
        let quant = 0;
        for (var i = 0; i < this.elementsList.length; i++)
        {

            if (this.elementsList[i].listScl)
            {
                listSizes.push(this.elementsList[i].listScl)
                sum += this.elementsList[i].listScl;
                quant++;
            }
            else
            {
                listSizes.push(0);
            }
        }
        let adjust = 1 - sum;
        let scales = adjust / ((this.elementsList.length) - quant);
        let chunkSize = 0;
        for (var i = 0; i < this.elementsList.length; i++)
        {
            if (listSizes[i] == 0)
            {
                listSizes[i] = scales
            }
        }
        let plus = 0;
        let positions = [];
        let stdH = 1;
        let stdW = 1;
        for (var i = 0; i < listSizes.length; i++)
        {
            // let pixig = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 5)
            // this.container.addChild(pixig)
            plus = 0;
            let nextX = 0;
            chunkSize = this.w * listSizes[i];
            if (i == 0)
            {
                nextX = 0;
            }
            else
            {
                nextX = positions[i - 1] + this.w * listSizes[i - 1]
            }
            positions.push(nextX);
            if (this.elementsList[i].fitHeight)
            {
                stdH = (this.elementsList[i].height / this.elementsList[i].scale.y)
                this.elementsList[i].scale.set(this.h / stdH * this.elementsList[i].fitHeight)
            }
            else if (this.elementsList[i].fitWidth)
            {
                stdW = (this.elementsList[i].width / this.elementsList[i].scale.x)
                this.elementsList[i].scale.set(chunkSize / stdW * this.elementsList[i].fitWidth)
            }
            else if (this.elementsList[i].scaleContent)
            {
                stdW = (this.elementsList[i].width / this.elementsList[i].scale.x)
                this.elementsList[i].scale.set(chunkSize / stdW)
            }
            else if (this.elementsList[i].scaleContentMax && (this.elementsList[i].width > chunkSize))
            {
                stdW = (this.elementsList[i].width / this.elementsList[i].scale.x)
                this.elementsList[i].scale.set(chunkSize / stdW)
            }
            let align = 0.5
            if (this.elementsList[i].align != undefined)
            {
                align = this.elementsList[i].align;
            }

            this.elementsList[i].x = nextX + chunkSize * align - this.elementsList[i].width * align;
            // pixig.x = nextX

            this.elementsList[i].y = this.h / 2 - this.elementsList[i].height / 2
        }

    }
}