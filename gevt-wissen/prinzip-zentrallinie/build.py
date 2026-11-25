"""Sprecher (Piper, Stimme Thorsten), Musik, Geraeusche und timeline.js fuer clip.html.
Aufruf: python3 build.py <ordner-mit-de-thorsten-low.onnx>   -> clip.wav, timeline.js"""
import numpy as np, wave, sys, subprocess, json, os
SR=44100; here=os.path.dirname(os.path.abspath(__file__)); model=os.path.join(sys.argv[1],'de-thorsten-low.onnx')
CUE={'geo':{'arc':.04,'str':.2,'cnt':.4,'go':.7,'dur':.16},'wdg':{'c1':.14,'go':.5,'hit':.62,'keil':.74},'fr':{'show':.08,'rot':.3,'ok':.46,'chain':.66}}
TEXT=[
"Ein Prinzip im Wing Tschun: die Zentrallinie. Am besten sieht man sie von oben.",
"Die Zentrallinie verbindet deine Mitte mit der Mitte des Gegners. Auf ihr liegen die empfindlichsten Ziele. Und sie ist der kürzeste Weg.",
"Ein Schwinger läuft im Bogen. Ein gerader Stoß nimmt die Linie. Ein Halbkreis ist über die Hälfte länger als die Gerade. Bei gleichem Tempo ist die Gerade also zuerst da.",
"Auf der Linie ist nur Platz für einen. Wer mit dem Ellbogen innen die Mitte besetzt, drängt den anderen Arm wie ein Keil nach außen.",
"Deshalb steht man frontal. So sind beide Hände gleich nah am Ziel, und beide können angreifen und schützen.",
"Die Zentrallinie. Die eigene Mitte schützen, die fremde angreifen."]
def rd(p):
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float)/32768; w.close(); return x
segs=[]
for i,t in enumerate(TEXT):
    a=f'/tmp/_p{i}.wav'; b=f'/tmp/_p{i}r.wav'
    subprocess.run([sys.executable,'-m','piper','-m',model,'-f',a,'--length-scale','0.98','--sentence-silence','0.22','--',t],check=True,capture_output=True)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',a,'-ar',str(SR),'-ac','1',b],check=True); segs.append(rd(b))
LEAD=.35; PAD=[.7,1.0,1.2,1.3,1.4,2.8]; tl=[]; t=0
for i,s in enumerate(segs):
    d=LEAD+len(s)/SR+PAD[i]; tl.append({'s':round(t,3),'d':round(d,3)}); t+=d
DUR=t; n=int(DUR*SR)+1; voice=np.zeros(n); fx=np.zeros(n); mus=np.zeros(n); rng=np.random.default_rng(5); tt=np.arange(n)/SR
for s,c in zip(segs,tl): i=int((c['s']+LEAD)*SR); voice[i:i+len(s)]+=s
voice/=np.abs(voice).max()
def add(buf,sig,t,g=1.0):
    i=int(t*SR); m=min(len(sig),n-i)
    if i>=0 and m>0: buf[i:i+m]+=sig[:m]*g
def env(d,k): t=np.arange(int(d*SR))/SR; return t,np.exp(-t*k)
def kick(): t,e=env(.3,11); return np.sin(2*np.pi*np.cumsum(45+90*np.exp(-t*30))/SR)*e
def snare(): t,e=env(.18,22); return (rng.standard_normal(len(t))*.8+np.sin(2*np.pi*190*t)*.5)*e
def hat(): t,e=env(.05,90); return np.diff(rng.standard_normal(len(t)+1))*e
def pow_(): t,e=env(.5,9); return np.tanh((np.sin(2*np.pi*np.cumsum(50+140*np.exp(-t*25))/SR)*e+rng.standard_normal(len(t))*np.exp(-t*28))*2.2)
def wood(f=900): t,e=env(.12,50); return (np.sin(2*np.pi*f*t)+.5*np.sin(2*np.pi*f*2.7*t))*e
def whoosh(d=.22):
    m=int(d*SR); x=rng.standard_normal(m); k=np.linspace(40,4,m).astype(int); c=np.cumsum(x); y=np.array([(c[i]-c[max(0,i-k[i])])/k[i] for i in range(m)]); return y*np.sin(np.pi*np.arange(m)/m)**2
def ding(): t,e=env(.9,5); return (np.sin(2*np.pi*1318.5*t)+.6*np.sin(2*np.pi*1975.5*t))*e
def note(f,d=.28): t,e=env(d,9); return ((np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*2*f*t)+.2*np.sin(2*np.pi*3*f*t))*e*np.clip(t/.005,0,1))
# Musik: Synth, 100 BPM
B=.6; ROOT=[55,43.65,65.41,49]; CH=[(220,261.63,329.63),(174.61,220,261.63),(261.63,329.63,392),(196,246.94,293.66)]
def bass(f,d=.28): t,e=env(d,7); return sum(np.sin(2*np.pi*f*k*t)/k for k in range(1,6))*e*np.clip(t/.004,0,1)
def zap(): t,e=env(.16,14); return np.sin(2*np.pi*np.cumsum(1900*np.exp(-t*16)+260)/SR)*e
def blip(f=1250): t,e=env(.05,60); return np.sin(2*np.pi*f*t)*e
k=0; b=0.0
while b<DUR-1.4:
    bar=(k//8)%4
    add(mus,bass(ROOT[bar]),b,.55)
    if k%2==0: add(mus,kick(),b,.75)
    else: add(mus,hat(),b,.14)
    if k%4==2: add(mus,snare(),b,.22)
    if b>tl[1]['s']:
        for j in range(2): add(mus,note(CH[bar][(k*2+j)%3]*(2 if (k+j)%4==3 else 1),.16),b+j*B/4,.13)
    if k%8==0:
        m=min(int(4.8*SR),n-int(b*SR)); ct=np.arange(m)/SR; add(mus,sum(np.sin(2*np.pi*f*ct)+.5*np.sin(2*np.pi*f*1.004*ct) for f in CH[bar])*np.clip(ct/.6,0,1)*np.clip((4.8-ct)/.8,0,1),b,.045)
    k+=1; b+=B/2
mus*=np.clip(tt/.4,0,1)*np.clip((DUR-tt)/1.5,0,1)
def at(i,f): return tl[i]['s']+f*tl[i]['d']
ge,wd,fr=CUE['geo'],CUE['wdg'],CUE['fr']
for c in tl: add(fx,blip(),c['s']+.15,.3); add(fx,blip(1650),c['s']+.24,.25)
add(fx,zap()[::-1],at(1,.05),.3); add(fx,blip(900),at(1,.42),.3); add(fx,blip(1100),at(1,.5),.3); add(fx,blip(1300),at(1,.58),.3); add(fx,ding(),at(1,.8),.25)
add(fx,blip(700),at(2,ge['arc']),.3); add(fx,blip(1400),at(2,ge['str']),.3); add(fx,zap(),at(2,ge['go']),.4); add(fx,pow_(),at(2,ge['go']+ge['dur']),.8); add(fx,ding(),at(2,ge['go']+ge['dur'])+.25,.3)
add(fx,zap(),at(3,wd['c1'])-.12,.35); add(fx,wood(500),at(3,wd['c1']),.7); add(fx,zap(),at(3,wd['go']),.4); add(fx,wood(900),at(3,(wd['go']+wd['hit'])/2),.4); add(fx,pow_(),at(3,wd['hit']),.9); add(fx,ding(),at(3,wd['keil']),.3)
add(fx,blip(500),at(4,fr['show']),.3); add(fx,zap()[::-1],at(4,fr['rot']),.35); add(fx,ding(),at(4,fr['ok']),.3)
k=at(4,fr['chain'])
while k<tl[4]['s']+tl[4]['d']-.3: add(fx,wood(260),k,.25); k+=.3
add(fx,ding(),at(5,.1),.3)
mix=np.tanh(voice*1.3+mus*.2+fx*.45); mix/=np.abs(mix).max()/.9
w=wave.open(os.path.join(here,'clip.wav'),'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes()); w.close()
open(os.path.join(here,'timeline.js'),'w').write('window.TL='+json.dumps(tl)+';window.DUR='+str(round(DUR,3))+';window.CUE='+json.dumps(CUE)+';\n')
print('Dauer',round(DUR,2),[c['d'] for c in tl])
