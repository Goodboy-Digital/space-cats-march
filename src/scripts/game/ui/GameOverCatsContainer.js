import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import GameOverItemContainer from './GameOverItemContainer';
import UIList from './uiElements/UIList';
import GameOverCatsList from './GameOverCatsList';
export default class GameOverCatsContainer extends UIList
{
    constructor()
    {
        super();
        this.onHide = new Signals();


        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.75;
        this.interactive = true;
        this.buttonMode = true;
        this.on('mouseup', this.collect.bind(this)).on('touchend', this.collect.bind(this));
        this.addChild(this.prizeDark);

        // this.starBackground = new PIXI.Sprite.from('results_newcat_rays_02');
        // this.starBackground.anchor.set(0.5)
        // this.addChild(this.starBackground);
        // this.starBackground.x = config.width / 2;
        // this.starBackground.y = config.height / 2;
        // this.starBackgroundScale = config.width / this.starBackground.width * 0.75;
        // this.starBackground.scale.set(this.starBackgroundScale)

        this.backgroundContainer = new PIXI.Container();
        let tiled = new PIXI.extras.TilingSprite(PIXI.Texture.from('pattern'), 132, 200);
        tiled.width = config.width;
        tiled.height = config.height;
        tiled.alpha = 0.05
        tiled.tileScale.set(0.5)


        let bgColor = new PIXI.Graphics().beginFill(0x12073f).drawRect(0, 0, config.width, config.height);
        this.backgroundContainer.addChild(bgColor)

        let bigBlur = new PIXI.Sprite(PIXI.Texture.from('bigblur'));
        this.backgroundContainer.addChild(bigBlur)
        bigBlur.width = this.width // 2;
        bigBlur.height = this.height // 2;
        bigBlur.alpha = 0.2
        bigBlur.anchor.set(0.5);

        this.backgroundContainer.addChild(tiled)

        this.backgroundContainer.alpha = 0.5
            // this.backgroundContainer.addChild(this.logoMask)
            // this.backgroundContainer.mask = this.logoMask
        this.addChild(this.backgroundContainer);

        this.prizesContainer = new PIXI.Container();
        this.addChild(this.prizesContainer);
        this.itensList = [];
        this.itensList1 = [];
        this.itensList2 = [];

        this.listRect = {
            w: config.width * 0.3,
            h: config.height * 0.65
        }
        this.pageItens = 6

        this.gameOverCatList1 = new GameOverCatsList(this.listRect, this.pageItens);
        this.gameOverCatList2 = new GameOverCatsList(this.listRect, this.pageItens);

        this.w = config.width * 0.5
        this.h = config.height * 0.5


        this.prizesContainer.addChild(this.gameOverCatList1);
        this.prizesContainer.addChild(this.gameOverCatList2);
        this.gameOverCatList2.x = this.gameOverCatList1.x + this.listRect.w
        this.prizesContainer.x = config.width / 2 - this.w / 2;
        this.prizesContainer.y = config.height / 2 - this.h / 2;

        let found = GAME_DATA.shopDataStatic.find(function(element)
        {
            return element.type == 'cat_multiplier';
        });
        this.shopStaticData = found;
        this.itensPool = [];

        console.log(found);
        // this.itemData = cat_multiplier
        // this.show([15,15,15,15,15,15,15,15,15]);

    }
    update(delta)
    {
        // if (this.visible)
        // {
        //     this.starBackground.rotation += 0.05
        // }
    }
    collect()
    {
        this.onHide.dispatch();
        this.hide();
    }
    addCatItem(id)
    {
    	let staticCat = GAME_DATA.getStaticCatData(id);

        let item = null;
        // console.log('POOL', this.itensPool);
        if(this.itensPool.length > 0){
        	item = this.itensPool[0];
        	this.itensPool.shift();
        }else{
        	item = new GameOverItemContainer(this.w / 3, this.listRect.h / this.pageItens);
        }
        
        item.scaleContentMax = true;
        item.setCat(staticCat.catSrc);
        item.setValue();
        if (this.itensList.length % 2 == 0)
        {
            this.itensList1.push(item);
        }
        else
        {
            this.itensList2.push(item);
        }
        this.itensList.push(item);
        // this.elementsList.push(item);
        this.prizesContainer.addChild(item);

        
    }
    hide()
    {
        for (var i = 0; i < this.itensList.length; i++)
        {
            this.itensPool.push(this.itensList[i]);
        }
        this.itensList = [];
        this.itensList1 = [];
        this.itensList2 = [];
        this.gameOverCatList1.dispose();
        this.gameOverCatList2.dispose();
        this.visible = false;
    }
    show(catList)
    {
    	for (var i = 0; i < catList.length; i++) {
    		if(catList[i] > 0){
    			this.addCatItem(i);
    		}
    	}

    	this.gameOverCatList1.addItens(this.itensList1);
        this.gameOverCatList2.addItens(this.itensList2);

        let dynamicData = GAME_DATA.shopData[this.shopStaticData.id]
        if (dynamicData.level > 0)
        {
            this.leveledShopData = GAME_DATA.getActionStats(dynamicData);
            console.log('SHOW PRIZE', this.leveledShopData);
        }
        let list = GAME_DATA.getChestPrize();

        for (var i = 0; i < this.itensList.length; i++)
        {
            this.itensList[i].forceHide();
        }
        // this.updateHorizontalList();

        for (var i = 0; i < this.itensList.length; i++)
        {
            let item = list[i] //this.itensList[i];
            let itemC = this.itensList[i]
            let delay = 0.15 * i + 0.1
            itemC.show(delay);
            itemC.setValue(catList[i])

            if (dynamicData.level > 0)
	        {
	            catList[i] *= this.leveledShopData.value;
	            catList[i] = Math.ceil(catList[i]);
            	itemC.updateQuant(catList[i], false, delay + 1)
	        }

        }
        this.prizeDark.alpha = 0;


        TweenLite.to(this.prizeDark, 0.5,
        {
            alpha: 0.75
        });
        this.visible = true;

        return catList
    }
}