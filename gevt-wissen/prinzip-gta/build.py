"""Sprecher (Piper, Stimme Thorsten), Musik, Geraeusche und timeline.js fuer clip.html.
Aufruf: python3 build.py <ordner-mit-de-thorsten-low.onnx>  -> clip.wav, timeline.js"""
import numpy as np, wave, sys, subprocess, json, os
SR=44100; here=os.path.dirname(os.path.abspath(__file__)); model=os.path.join(sys.argv[1],'de-thorsten-low.onnx')
CUE={'stiff':{'up':.18,'hi':.42,'down':.66},'push':{'in':.2,'out':.7},'res':{'bar':.25,'full':.7}}
TEXT=[
"Mission eins. Klebende Arme. Chi Sao, das Spüren im ständigen Kontakt.",
"Du fühlst den Druck des Gegners, bevor du ihn siehst. Dafür brauchst du Ruhe in den Armen.",
"Verspannst du dich, wirst du sichtbar. Jeder sieht deine Kraft, und der Gegner liest dich sofort.",
"Locker bleiben. Nicht Widerstand leisten, sondern weiterleiten. Drückt er, weicht deine Linie aus, und du gehst mit.",
"Ergebnis: volle Kontrolle. Keine Kraft gegen Kraft.",
"Mission bestanden. Klebende Arme. Ving Tsun."]
def rd(p):
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float)/32768; w.close(); return x
segs=[]
for i,t in enumerate(TEXT):
    a=f'/tmp/_g{i}.wav'; b=f'/tmp/_g{i}r.wav'
    subprocess.run([sys.executable,'-m','piper','-m',model,'-f',a,'--length-scale','1.0','--sentence-silence','0.2','--',t],check=True,capture_output=True)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',a,'-ar',str(SR),'-ac','1',b],check=True); segs.append(rd(b))
LEAD=.35; PAD=[.8,1.0,1.1,1.2,1.1,2.8]; tl=[]; t=0
for i,s in enumerate(segs):
    d=LEAD+len(s)/SR+PAD[i]; tl.append({'s':round(t,3),'d':round(d,3)}); t+=d
DUR=t; n=int(DUR*SR)+1; voice=np.zeros(n); fx=np.zeros(n); mus=np.zeros(n); rng=np.random.default_rng(11); tt=np.arange(n)/SR
for s,c in zip(segs,tl): i=int((c['s']+LEAD)*SR); voice[i:i+len(s)]+=s
voice/=np.abs(voice).max()
def add(buf,sig,t,g=1.0):
    i=int(t*SR); m=min(len(sig),n-i)
    if i>=0 and m>0: buf[i:i+m]+=sig[:m]*g
def env(d,k): t=np.arange(int(d*SR))/SR; return t,np.exp(-t*k)
def kick(): t,e=env(.3,11); return np.sin(2*np.pi*np.cumsum(45+90*np.exp(-t*30))/SR)*e
def snare(): t,e=env(.18,22); return (rng.standard_normal(len(t))*.8+np.sin(2*np.pi*190*t)*.5)*e
def hat(): t,e=env(.05,90); return np.diff(rng.standard_normal(len(t)+1))*e
def bass(f,d=.3): t,e=env(d,6); return sum(np.sin(2*np.pi*f*k*t)/k for k in range(1,5))*e*np.clip(t/.004,0,1)
def pow_(): t,e=env(.5,9); return np.tanh((np.sin(2*np.pi*np.cumsum(50+140*np.exp(-t*25))/SR)*e+rng.standard_normal(len(t))*np.exp(-t*28))*2.2)
def wood(f=900): t,e=env(.12,50); return (np.sin(2*np.pi*f*t)+.5*np.sin(2*np.pi*f*2.7*t))*e
def ding(): t,e=env(.9,5); return (np.sin(2*np.pi*1318.5*t)+.6*np.sin(2*np.pi*1975.5*t))*e
def siren(d=.9): t=np.arange(int(d*SR))/SR; f=600+350*np.sin(2*np.pi*1.6*t); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.clip(t/.05,0,1)*np.clip((d-t)/.1,0,1)*.6
def ka(): t,e=env(.25,18); return (np.sin(2*np.pi*2400*t)+np.sin(2*np.pi*3100*t))*e*.5
# Musik: treibender Synth-Beat, 120 BPM, Moll
B=.5; ROOT=[41.2,36.7,38.9,30.9]
k=0; b=0.0
while b<DUR-1.4:
    bar=(k//8)%4
    add(mus,bass(ROOT[bar]),b,.6)
    if k%2==0: add(mus,kick(),b,.8)
    else: add(mus,hat(),b,.16)
    if k%4==2: add(mus,snare(),b,.25)
    k+=1; b+=B
mus*=np.clip(tt/.4,0,1)*np.clip((DUR-tt)/1.5,0,1)
def at(i,f): return tl[i]['s']+f*tl[i]['d']
st=CUE['stiff']
add(fx,siren(.7),0.05,.25)
add(fx,wood(700),at(1,.05),.5); add(fx,ding(),at(1,.1),.3)
add(fx,siren(tl[2]['d']*st['hi']),at(2,st['up']),.35)
add(fx,pow_(),at(2,st['hi']),.6)
add(fx,wood(400),at(3,.3),.5); add(fx,wood(900),at(3,CUE['push']['out']),.5)
add(fx,ka(),at(4,CUE['res']['bar']),.5); add(fx,ka(),at(4,CUE['res']['full']),.5)
add(fx,ding(),at(5,.1),.35); add(fx,ding(),at(5,.45),.3)
for c in tl[1:]: add(fx,siren(.25),c['s']-.12,.12)
mix=np.tanh(voice*1.3+mus*.22+fx*.5); mix/=np.abs(mix).max()/.9
w=wave.open(os.path.join(here,'clip.wav'),'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes()); w.close()
open(os.path.join(here,'timeline.js'),'w').write('window.TL='+json.dumps(tl)+';window.DUR='+str(round(DUR,3))+';window.CUE='+json.dumps(CUE)+';\n')
print('Dauer',round(DUR,2),[c['d'] for c in tl])
