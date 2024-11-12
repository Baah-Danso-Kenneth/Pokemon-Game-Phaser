

import { MONSTER_ASSET_KEYS } from "../../assets/assets-key";

const BATTLE_MENU_OPTIONS = Object.freeze({
    FIGHT:'FIGHT',
    SWITCH:'SWITCH',
    ITEM:'ITEM',
    FLEE:'FLEE'
})


const battleTextStyle={
    color:'black',
    fontSize:'30px',
}



export class BattleMenu{
    /** @type {Phaser.Scene} */
    #scene
    #mainBattleMenuPhaserContainerGameObject;
    #moveSelectionSubBattlePhaserContainerGameObject;
    #battletextObjectLine1
    #battletextObjectLine2


    showBattleMenu(){
        this.#battletextObjectLine1.setText('What should')
        this.#mainBattleMenuPhaserContainerGameObject.setAlpha(1)
        this.#battletextObjectLine1.setAlpha(1)
        this.#battletextObjectLine2.setAlpha(1)
    }


    hideMainBattleMenu(){
        this.#mainBattleMenuPhaserContainerGameObject.setAlpha(0);
        this.#battletextObjectLine1.setAlpha(0);
        this.#battletextObjectLine2.setAlpha(0);

    }

    showMonsterAttackSubMenu(){
        this.#moveSelectionSubBattlePhaserContainerGameObject.setAlpha(1)
    }

    hideMonsterAttackSubMenu(){
        this.#moveSelectionSubBattlePhaserContainerGameObject.setAlpha(0)
    }


    constructor(scene){
        this.#scene=scene
        this.#createMainInfoPane();
        this.#createMainBattleMenu();
        this.#createMonsterAttackSubMenu();
    }



    #createMainBattleMenu(){
        this.#battletextObjectLine1 = this.#scene.add.text(20, 468, 'What should', battleTextStyle)
        this.#battletextObjectLine2 = this.#scene.add.text(20, 512, `${MONSTER_ASSET_KEYS.IGNITE} do Next?`, battleTextStyle)

        this.#mainBattleMenuPhaserContainerGameObject = this.#scene.add.container(
            520, 448,
              [ this.#createMainInfoSubPane(),
                this.#scene.add.text(55, 22, BATTLE_MENU_OPTIONS.FIGHT,battleTextStyle),
                this.#scene.add.text(240, 22, BATTLE_MENU_OPTIONS.ITEM,battleTextStyle),
                this.#scene.add.text(55, 70, BATTLE_MENU_OPTIONS.SWITCH,battleTextStyle),
                this.#scene.add.text(240, 70, BATTLE_MENU_OPTIONS.FLEE,battleTextStyle),
              ]
           );
           this.hideMainBattleMenu()
        
    }

    #createMonsterAttackSubMenu(){
        this.#moveSelectionSubBattlePhaserContainerGameObject=this.#scene.add.container(
            0, 448,
              [ 
                this.#scene.add.text(55, 22, 'Slash',battleTextStyle),
                        this.#scene.add.text(240, 22, 'growl',battleTextStyle),
                        this.#scene.add.text(55, 70, '_',battleTextStyle),
                        this.#scene.add.text(240, 70, '_',battleTextStyle),
              ]
           );
           this.hideMonsterAttackSubMenu();
    }


    #createMainInfoPane(){
        const padding=4;
        const rectHeight=124;
        return  this.#scene.add.rectangle(
            padding,
            this.#scene.scale.height - rectHeight - padding,
             this.#scene.scale.width - padding *2,
              rectHeight,
              0xede4f3,
              1)
              .setOrigin(0)
              .setStrokeStyle(8, 0xe4434a,1);
    }


    #createMainInfoSubPane(){
        const rectWidth=500;
        const rectHeight=124;

        return this.#scene.add
        .rectangle(
            0,0, rectWidth, rectHeight, 0xede4f3,1)
        .setOrigin(0)
        .setStrokeStyle(8, 0x905ac2,1)
    }


}
