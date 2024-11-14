import { BACKGROUND_KEYS } from "../../assets/assets-key";

export class Background{
    /**@type {Phaser.Scene} */
    #scene
    /**@type {Phaser.GameObjects.Image} */

    #backgroundGameObject;
    constructor(scene){
        this.#scene = scene
        this.#backgroundGameObject = this.#scene.add.image(
            0,0, 
            BACKGROUND_KEYS.FOREST)
            .setOrigin(0)
            .setAlpha(0);
    }


    showForest(){
        this.#backgroundGameObject.setTexture(BACKGROUND_KEYS.FOREST).setAlpha(1)
    }
}