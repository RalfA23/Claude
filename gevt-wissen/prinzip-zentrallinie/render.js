// Rendert clip.html Bild für Bild zu MP4 (30 fps) mit clip.wav aus build.py.
// Aufruf: python3 build.py <stimmen-ordner> && node render.js
const {chromium}=require('playwright'),{spawn}=require('child_process'),path=require('path');
(async()=>{
  const dir=__dirname,FPS=30,out=path.join(dir,'zentrallinie.mp4');
  const b=await chromium.launch(),p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+path.join(dir,'clip.html')+'#cap');await p.evaluate(()=>document.fonts.load('900 100px "Inter Display"'));
  const DUR=await p.evaluate(()=>DUR);
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',FPS,'-c:v','mjpeg','-i','-','-i',path.join(dir,'clip.wav'),'-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-ar','48000','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<Math.ceil(FPS*DUR);i++){
    const d=await p.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',.95)},i/FPS);
    if(!ff.stdin.write(Buffer.from(d.split(',')[1],'base64')))await new Promise(r=>ff.stdin.once('drain',r));
  }
  ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('ok',out,DUR);
})();
