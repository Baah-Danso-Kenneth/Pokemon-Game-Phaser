import Phaser from "phaser";
import { SCENE_KEYS } from "./scene-keys";
import { BACKGROUND_KEYS, BATTLE_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../assets/assets-key";


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

export class BattleScene extends Phaser.Scene{
    constructor(){
        super({key: SCENE_KEYS.BATTLE_SCENE})
    }



    create(){
        this.add.image(0,0,BACKGROUND_KEYS.FOREST).setOrigin(0)

        this.add.image(768, 144, MONSTER_ASSET_KEYS.CARNOUSK)
        this.add.image(256, 316, MONSTER_ASSET_KEYS.IGNITE,0).setFlipX(true)

        const playerMonsterName = this.add.text(
            30,
            20,
            MONSTER_ASSET_KEYS.IGNITE,{
                color: '#7E3D3F',
                fontSize:'32px'
            }
        );
        const MonsterName = this.add.text(
            30,
            20,
            MONSTER_ASSET_KEYS.CARNOUSK,{
                color: '#7E3D3F',
                fontSize:'32px'
            }
        );

        this.add.container(556, 318,
            [   
                this.add.image(0,0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0),
                playerMonsterName,
                this.#createHealth(34,34),

                this.add.text(
                    playerMonsterName.width + 35,
                    23,
                    'L5',
                    {
                        color: '#ED474B',
                        fontSize:'28px'
                    }
                ),

                this.add.text(
                   30,
                    55,
                    'HP',
                    {
                        color: '#FF6505',
                        fontSize:'24px',
                        fontStyle:'italic'
                    }
                ),

                this.add.text(
                    443,
                     80,
                     '25/25',
                     {
                         color: '#7E3D3F',
                         fontSize:'16px',
                    
                     }
                 ).setOrigin(1,0)
            ]);


        
            this.add.container(26, 18,
                [   
                    this.add.image(
                        0,0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0),
                        MonsterName,
                    this.#createHealth(34,34),
    
                    this.add.text(
                        MonsterName.width + 35,
                        23,
                        'L5',
                        {
                            color: '#ED474B',
                            fontSize:'28px'
                        }
                    ),
    
                    this.add.text(
                       30,
                        55,
                        'HP',
                        {
                            color: '#FF6505',
                            fontSize:'24px',
                            fontStyle:'italic'
                        }
                    ),
    
                    this.add.text(
                        443,
                         80,
                         '25/25',
                         {
                             color: '#7E3D3F',
                             fontSize:'16px',
                        
                         }
                     ).setOrigin(1,0)
                ]);

        this.#createMainInfoPane();
        this.add.container(
            520, 448,[
                this.#createSubInfoPane(),
                this.add.text(55, 22, BATTLE_MENU_OPTIONS.FIGHT,battleTextStyle),
                this.add.text(240, 22, BATTLE_MENU_OPTIONS.ITEM,battleTextStyle),
                this.add.text(55, 70, BATTLE_MENU_OPTIONS.SWITCH,battleTextStyle),
                this.add.text(240, 70, BATTLE_MENU_OPTIONS.FLEE,battleTextStyle),


            ]
        );


        this.add.container(
            0, 448,[
                this.add.text(55, 22, 'Slash',battleTextStyle),
                this.add.text(240, 22, 'growl',battleTextStyle),
                this.add.text(55, 70, '_',battleTextStyle),
                this.add.text(240, 70, '_',battleTextStyle),


            ]
        )

    }

    #createHealth(x,y){
        const scaleY=0.7;

        const leftCap = this.add.image(
            x,y,HEALTH_BAR_ASSET_KEYS.LEFT_CAP 
        ).setOrigin(0,0.5)
        .setScale(1, scaleY)
        const middleCap = this.add.image(
            leftCap.x + leftCap.width,y, HEALTH_BAR_ASSET_KEYS.MIDDLE
        ).setOrigin(0,0.5)
        .setScale(1, scaleY)
        middleCap.displayWidth=360;
        const rightCap = this.add.image(
            middleCap.x + middleCap.displayWidth,y, HEALTH_BAR_ASSET_KEYS.RIGHT_CAP
        ).setOrigin(0,0.5)
        .setScale(1,scaleY)
        return this.add.container(x,y,[leftCap, middleCap, rightCap]);
    }

    #createSubInfoPane(){
        const rectWidth=500;
        const rectHeight=124;

        return this.add.rectangle(0,0, rectWidth, rectHeight, 0xede4f3,1)
        .setOrigin(0)
        .setStrokeStyle(8, 0x905ac2,1)
    }

    #createMainInfoPane(){
        const padding=4;

        const rectHeight=124;
        this.add.rectangle(
            padding, 
            this.scale.height - rectHeight-padding,
             this.scale.width - padding * 2,
              rectHeight,
              0xede4f3,
              1)
              .setOrigin(0)
              .setStrokeStyle(8, 0xe4434a,1);
    }
}