export function createAudio(){
 let context=null;
 return {
  play(index=2,timbre='sine'){
   try{
    context??=new (window.AudioContext||window.webkitAudioContext)();
    context.resume().catch(()=>{});
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.type=['sine','triangle'].includes(timbre)?timbre:'sine';
    oscillator.frequency.setValueAtTime([261.63,293.66,329.63,392,440][index]??329.63,context.currentTime);
    oscillator.connect(gain);gain.connect(context.destination);
    gain.gain.setValueAtTime(.025,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.25);
    oscillator.start();oscillator.stop(context.currentTime+.26);return true;
   }catch{return false;}
  },
  suspend(){context?.suspend().catch(()=>{});},
  dispose(){context?.close().catch(()=>{});context=null;}
 };
}
