import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState } from "../render/core/controllerInput.js";

let cx, cy, tx, ty, theta;
//let s = 1;

export const init = async model => {
   cx = 0, cy = 1.5, tx = 0, ty = 0, theta = 0;

   model.control('a', 'left' , () => tx -= .1);
   model.control('s', 'down' , () => ty -= .1);
   model.control('d', 'right', () => tx += .1);
   model.control('w', 'up'   , () => ty += .1);

   model.control('l', 'controller left'  , () => cx -= .1);
   model.control('r', 'controller right' , () => cx += .1);

   model.control('f', 'rotate left'  , () => theta -= .1);
   model.control('g', 'rotate right' , () => theta += .1);

   // CREATE THE TARGET

   let target = model.add();
   target.add('cube').scale(1,1,.001);
   let target2 = model.add();
   target2.add('cube').scale(1,1,.001);
   
   

   // CREATE THE LASER BEAMS FOR THE LEFT AND RIGHT CONTROLLERS

   let beamL = model.add();
   beamL.add('cube').color(0,0,1).move(.02,0,0).scale(.02,.005,.005);
   beamL.add('cube').color(0,1,0).move(0,.02,0).scale(.005,.02,.005);
   beamL.add('tubeZ').color(1,0,0).move(0,0,-10).scale(.001,.001,10);

   let beamR = model.add(); 
   beamR.add('cube').color(1,0,0).move(.02,0,0).scale(.02,.005,.005);
   beamR.add('cube').color(0,0,1).move(0,.02,0).scale(.005,.02,.005);
   beamR.add('tubeZ').color(0,1,0).move(0,0,-10).scale(.001,.001,10);
   let target3 = model.add();
   let target4 = model.add();
}


export const display = model => {
   model.animate(() => {

      // GET THE CURRENT MATRIX AND TRIGGER INFO FOR BOTH CONTROLLERS

      let matrixL  = controllerMatrix.left;
      let triggerL = buttonState.left[0].pressed;
      

      let matrixR  = controllerMatrix.right;
      let triggerR = buttonState.right[0].pressed;

  // ANIMATE THE TARGET

      let target = model.child(0);
      let target2 = model.child(1);
      let target3 = model.child(4);
      let target4 = model.child(5);
      target.identity()
            .move(tx-1, 1.5 + ty, 0)
            //.turnY(theta + Math.sin(model.time))
            .scale(.5,.3,1);
      target2.identity()
            .move(tx+1, 1.5 + ty, 0)
            //.turnY(theta + Math.sin(model.time))
            .scale(.5,.3,1);

      // PLACE THE LASER BEAMS TO EMANATE FROM THE CONTROLLERS
      // IF NOT IN VR MODE, PLACE THE BEAMS IN DEFAULT POSITIONS

      let LM = matrixL.length ? cg.mMultiply(matrixL, cg.mTranslate( .006,0,0)) : cg.mTranslate(cx-.2,cy,1);
      let RM = matrixR.length ? cg.mMultiply(matrixR, cg.mTranslate(-.001,0,0)) : cg.mTranslate(cx+.2,cy,1);

      model.child(2).setMatrix(LM);
      model.child(3).setMatrix(RM);

  // CHECK TO SEE WHETHER EACH BEAM INTERSECTS WITH THE TARGET

      let hitL = cg.mHitRect(LM, target.getMatrix());
      let hitR = cg.mHitRect(RM, target.getMatrix());
        //console.log(target.getMatrix());

      let hitL2 = cg.mHitRect(LM, target2.getMatrix());
      let hitR2 = cg.mHitRect(RM, target2.getMatrix());

     
    //SCALE THE OBJECT
    


  // CHANGE TARGET COLOR DEPENDING ON WHICH BEAM(S) HIT IT AND WHAT TRIGGERS ARE PRESSED

      target.color(hitL && hitR ? triggerL || triggerR ? [0,0,1] : [.5,.5,1] :
                           hitL ? triggerL             ? [1,0,0] : [1,.5,.5] :
                           hitR ? triggerR             ? [0,1,0] : [.5,1,.5] : [1,1,1]);
      target2.color(hitL2 && hitR2 ? triggerL || triggerR ? [0,0,1] : [.5,.5,1] :
                           hitL2 ? triggerL             ? [1,0,0] : [1,.5,.5] :
                           hitR2 ? triggerR             ? [0,1,0] : [.5,1,.5] : [1,1,1]);
      let b1 = true;
      let b2 = true;

      //var previous=1;
      //var now=0.5;
    //   var factor;

      //if(buttonState.left[1].pressed && buttonState.right[1].pressed&&hitL&&hitR){
    //   if(hitL&&hitR){
    //     previous = Math.sqrt((matrixL[0]-matrixR[0])**2+(matrixL[1]-matrixR[1])**2);
    //   }
      
      
      //var previous = Math.sqrt((matrixL[0]-matrixR[0])**2+(matrixL[1]-matrixR[1])**2);
      //console.log(matrixL[12]);
      var previous1 = 0.3;
      if(hitL && hitR && (triggerL||triggerR)){
        var now1 = Math.sqrt((matrixL[12]-matrixR[12])**2+(matrixL[13]-matrixR[13])**2);
        let s1 = now1/previous1*1.3;
        //console.log(previous);
        target.scale(s1);
      }
      previous1 = Math.sqrt((matrixL[12]-matrixR[12])**2+(matrixL[13]-matrixR[13])**2);


    //CREATE NEW OBJECT BY HITTING RECTANGLE USING RIGHT CONTROLLER
      if(target._color[0] == 0 && target._color[1] == 1 && target._color[2] == 0 && b1){
        //console.log("yay" );
        target3.identity().add('cube').move(tx, 1.5 + ty, 0).scale(0.35,0.35,0.35).color(0.3,0.6,0.2);
        //target3.add('sphere').move(tx,  + ty, 0).scale(0.5,0.5,0.5).color(0,0,0);
        //target3.scale( hitL && hitR && triggerL && triggerR ? []:[])
        b1 = false;
      }
    //   let hitL3 = cg.mHitRect(LM, target3.getMatrix());
    //   let hitR3 = cg.mHitRect(RM, target3.getMatrix());

      
    //   if(hitL3 && hitR3 && (triggerL||triggerR)){
    //     var now = Math.sqrt((matrixL[12]-matrixR[12])**2+(matrixL[13]-matrixR[13])**2);
    //     let s = now/previous;
    //     //console.log(previous);
    //     target3.child(0).scale(s);
    //   }
    //   previous = Math.sqrt((matrixL[12]-matrixR[12])**2+(matrixL[13]-matrixR[13])**2);

      

        // target3.color(hitL3 && hitR3 ? triggerL || triggerR ? [0,0,1] : [.5,.5,1] :
        // hitL3 ? triggerL             ? [1,0,0] : [1,.5,.5] :
        // hitR3 ? triggerR             ? [0,1,0] : [.5,1,.5] : [0.3,0.6,0.2]);                     

        


      if(target2._color[0] == 0 && target2._color[1] == 1 && target2._color[2] == 0 && b2){
        //console.log("yay");
        //target3.add('cube').move(tx, 1.5 + ty, 0).scale(0.5,0.5,0.5).color(0,0,0);
        target4.identity().add('sphere').move(tx, 1.5 + ty, 0).scale(0.3,0.3,0.3).color(0.3,0.6,0.2);
        target4 = model.child(5);
        b2 = false;
      }
      

      
      

    //   let hitL4 = cg.mHitRect(LM, target4.getMatrix());
    //   let hitR4 = cg.mHitRect(RM, target4.getMatrix());
    //   target4.color(hitL4 && hitR4 ? triggerL || triggerR ? [0,0,1] : [.5,.5,1] :
    //     hitL4 ? triggerL             ? [1,0,0] : [1,.5,.5] :
    //     hitR4 ? triggerR             ? [0,1,0] : [.5,1,.5] : [0.3,0.6,0.2]);

      

      



      //DELETE OBJECT BY HITTING RECTANGLE USING LEFT CONTROLLER
      if(target._color[0] == 1 && target._color[1] == 0 && target._color[2] == 0){
        //console.log("yay");
        target3.remove(0);
      }

      if(target2._color[0] == 1 && target2._color[1] == 0 && target2._color[2] == 0){
        //console.log("yay");
        //target4.scale(0,0,0);
        target4.remove(0);
      }

   });
}
