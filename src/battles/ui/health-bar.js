import { HEALTH_BAR_ASSET_KEYS } from "../../assets/assets-key";


export class HealthBar{

    #healthBarContainer
    #fullWidth
    #scaleY
    #scene;
    #middle
    #leftCap
    #rightCap
    constructor(scene, x, y){
        this.#scene=scene
        this.#fullWidth=360
        this.#scaleY = 0.7
        this.#healthBarContainer = this.#scene.add.container(x,y,[]);
        this.#createHealthImages(x,y);
        this.#setMeterPercentage(1)
    }


    get container(){
        return this.#healthBarContainer;
    }

    #createHealthImages(x,y){

         this.#leftCap = this.#scene.add.image(
            x,y,HEALTH_BAR_ASSET_KEYS.LEFT_CAP 
        ).setOrigin(0,0.5)
        .setScale(1, this.#scaleY)
         this.#middle = this.#scene.add.image(
            this.#leftCap.x + this.#leftCap.width,y, HEALTH_BAR_ASSET_KEYS.MIDDLE
        ).setOrigin(0,0.5)
        .setScale(1, this.#scaleY)
        
         this.#rightCap = this.#scene.add.image(
            this.#middle.x + this.#middle.displayWidth,y, HEALTH_BAR_ASSET_KEYS.RIGHT_CAP
        ).setOrigin(0,0.5)
        .setScale(1,this.#scaleY)
        
        this.#healthBarContainer.add([this.#leftCap,this.#middle, this.#rightCap])
    }



    #setMeterPercentage(percent=1){
        const width = this.#fullWidth * percent

        this.#middle.displayWidth=width;

        this.#rightCap.x = this.#middle.x + this.#middle.displayWidth;

    }

}