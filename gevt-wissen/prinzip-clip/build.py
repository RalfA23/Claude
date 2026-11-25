"""Sprecher (Piper, Stimme Thorsten), Musik, Geraeusche und timeline.js fuer clip.html.
Aufruf: python3 build.py <ordner-mit-de-thorsten-low.onnx>   -> clip.wav, timeline.js"""
import numpy as np, wave, sys, subprocess, json, os
SR=44100; here=os.path.dirname(os.path.abspath(__file__)); model=os.path.join(sys.argv[1],'de-thorsten-low.onnx')
CUE={'v1':{'blk':.215,'two':.5,'gap':.66,'hit':.82},'v2':{'hit':.315,'c1':.42,'c2':.52,'one':.68,'ko':.86},'race':{'a':.08,'b':.8}}
TEXT=[
"Ein Prinzip im Wing Tschun: Gleichzeitigkeit. Was das bringt, sieht man am besten im Vergleich.",
"So reagieren die meisten. Erst abwehren. Dann zurückschlagen. Das sind zwei Bewegungen. Und in der Lücke dazwischen kommt schon der nächste Schlag.",
"Nochmal zurück.",
"Jetzt mit Gleichzeitigkeit. Ein Arm lenkt den Angriff ab, der andere trifft im selben Moment. Das ist eine Bewegung. Der zweite Schlag kommt gar nicht mehr.",
"Der Trick ist nicht, schneller zu sein. Du sparst einen ganzen Schritt. Der Gegner braucht zwei Zeiten, du nur eine.",
"Gleichzeitigkeit. Abwehr und Angriff sind eins."]
def rd(p):
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float)/32768; w.close(); return x
segs=[]
for i,t in enumerate(TEXT):
    a=f'/tmp/_p{i}.wav'; b=f'/tmp/_p{i}r.wav'
    subprocess.run([sys.executable,'-m','piper','-m',model,'-f',a,'--length-scale','0.98','--sentence-silence','0.22','--',t],check=True,capture_output=True)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',a,'-ar',str(SR),'-ac','1',b],check=True); segs.append(rd(b))
LEAD=.35; PAD=[.5,.9,.7,1.0,1.1,2.4]; tl=[]; t=0
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
# Musik 112 BPM
B=60/112; A=[110,110,130.81,146.83,110,110,164.81,146.83]; M=[440,523.25,587.33,659.25,783.99,659.25,587.33,523.25]
rw=tl[2]; k=0; b=0.0
while b<DUR-1.2:
    inrw=rw['s']<=b<rw['s']+rw['d']
    if not inrw:
        if k%2==0: add(mus,kick(),b,.9)
        if k%4==2: add(mus,snare(),b,.35)
        add(mus,hat(),b,.18); add(mus,hat(),b+B/2,.1)
        add(mus,note(A[(k//2)%8],.3),b,.5); 
        if k%2==1: add(mus,note(A[(k//2)%8]*2,.2),b,.25)
        if b>tl[1]['s'] and (k%8 in (0,3,5,6)): add(mus,note(M[(k*3)%8],.35),b+(B/2 if k%8==3 else 0),.16)
    k+=1; b+=B/2*2 if False else B/2
mus*=np.clip(tt/.4,0,1)*np.clip((DUR-tt)/1.5,0,1)
# Geraeusche passend zu den Bild-Cues
def at(i,f): return tl[i]['s']+f*tl[i]['d']
v1,v2,rc=CUE['v1'],CUE['v2'],CUE['race']
add(fx,whoosh(),at(1,v1['blk'])-.12,.5); add(fx,wood(),at(1,v1['blk']),.7)
add(fx,whoosh(),at(1,v1['hit'])-.12,.5); add(fx,pow_(),at(1,v1['hit']),.9)
m=int(rw['d']*SR); rt=np.arange(m)/SR; add(fx,np.sin(2*np.pi*np.cumsum(300+900*rt/rw['d']+120*np.sin(2*np.pi*14*rt))/SR)*.25*np.sin(np.pi*rt/rw['d'])**.5,rw['s'],.6)
add(fx,whoosh(),at(3,v2['hit'])-.12,.5); add(fx,wood(),at(3,v2['hit']),.6); add(fx,pow_(),at(3,v2['hit']),1.0); add(fx,ding(),at(3,v2['one']),.35)
rp=lambda p: at(4,rc['a']+(rc['b']-rc['a'])*p)
add(fx,wood(),rp(.115),.6); add(fx,pow_(),rp(.115),.8); add(fx,ding(),rp(.115)+.3,.3); add(fx,pow_(),rp(.897),.8)
add(fx,ding(),at(5,.1),.35)
for c in tl[1:]: add(fx,whoosh(.3),c['s']-.15,.25)
mix=np.tanh(voice*1.3+mus*.2+fx*.5); mix/=np.abs(mix).max()/.9
w=wave.open(os.path.join(here,'clip.wav'),'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes()); w.close()
open(os.path.join(here,'timeline.js'),'w').write('window.TL='+json.dumps(tl)+';window.DUR='+str(round(DUR,3))+';window.CUE='+json.dumps(CUE)+';\n')
print('Dauer',round(DUR,2),[c['d'] for c in tl])
