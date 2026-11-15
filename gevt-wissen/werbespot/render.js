// Rendert spot.html Bild für Bild zu MP4 (30 fps) und legt den Ton aus audio.py darunter.
const {chromium}=require('playwright'),{spawn,execSync}=require('child_process'),path=require('path');
(async()=>{
  const dir=__dirname,FPS=30,DUR=32,out=path.join(dir,'ge-ving-tsun-spot.mp4'),wav=path.join(dir,'spot.wav');
  execSync(`python3 ${path.join(dir,'audio.py')} ${wav}`);
  const b=await chromium.launch(),p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+path.join(dir,'spot.html')+'#cap');await p.evaluate(()=>document.fonts.load('900 100px "Inter Display"'));
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',FPS,'-c:v','mjpeg','-i','-','-i',wav,'-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','-shortest',out],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<FPS*DUR;i++){
    const d=await p.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',.95)},i/FPS);
    if(!ff.stdin.write(Buffer.from(d.split(',')[1],'base64')))await new Promise(r=>ff.stdin.once('drain',r));
  }
  ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();execSync(`rm ${wav}`);console.log('ok',out);
})();
