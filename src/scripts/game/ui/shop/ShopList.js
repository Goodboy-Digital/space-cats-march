import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import CatItem from '../CatItem';
import ListScroller from '../uiElements/ListScroller';
export default class ShopList extends ListScroller
{
    constructor(rect = {
        w: 500,
        h: 500
    }, itensPerPage = 4)
    {
        super(rect, itensPerPage);
        this.onItemShop = new Signals();
        // this.onShopItem = new Signals();
        this.container = new PIXI.Container();



        this.itens = [];
        
    }

    addItens(itens){
    	for (var i = 0; i < itens.length; i++)
        {
        	let tempItem = itens[i];
            this.catListContainer.addChild(tempItem)
            tempItem.y = this.itemHeight * this.itens.length - 1;
            if(tempItem.onConfirmShop){
            	tempItem.onConfirmShop.add(this.onShopItemCallback.bind(this));
            }
            this.itens.push(tempItem);

        }
        this.lastItemClicked = this.itens[0]
    }
    onShopItemCallback(itemData, realCost){
    	GAME_DATA.buyUpgrade(itemData, realCost);
        this.onItemShop.dispatch(itemData);
    	this.updateItems();
    }
    updateItems(){
    	for (var i = 0; i < this.itens.length; i++)
        {
        	this.itens[i].updateData()
        }
    }
    update(delta)
    {
       

    }
    updateAllItens()
    {
        for (var i = 0; i < this.catsItemList.length; i++)
        {
            this.catsItemList[i].updateItem(GAME_DATA.catsData[i])
        }
    }
    
}