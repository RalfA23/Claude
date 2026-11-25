"""Erzeugt Sprecher (Piper, Stimme Thorsten), Musik und timeline.js fuer film.html.
Aufruf: python3 build.py <ordner-mit-de-thorsten-low.onnx>   -> film.wav, timeline.js"""
import numpy as np, wave, sys, subprocess, json, os
SR=44100; here=os.path.dirname(os.path.abspath(__file__)); model=os.path.join(sys.argv[1],'de-thorsten-low.onnx')
TEXT=[ # gesprochener Text, lautnah geschrieben
"Wing Tschun. Ein Kung Fu Stil aus Südchina, gemacht für die kurze Distanz. Hier ist das Wichtigste, kurz erklärt.",
"Der Legende nach wurde der Stil von einer Frau entwickelt. Deshalb setzt er nicht auf Muskelkraft, sondern auf Struktur. Weltbekannt wurde er ab neunzehnhundertfünfzig durch Großmeister Ip Man in Hongkong. Sein berühmtester Schüler: Bruhs Li.",
"Die Grundidee ist die Zentrallinie. Sie verbindet deine Mitte mit der Mitte des Gegners. Der kürzeste Weg ist die Gerade. Wer die Mitte besetzt, ist zuerst da.",
"Die zweite Idee: Gleichzeitigkeit. Abwehr und Angriff sind nicht zwei Schritte, sondern eine Bewegung.",
"Das System ist überschaubar. Drei Handformen: Siu Nim Tau, die kleine Idee. Tschamm Kiu, das Suchen der Brücke. Und Biu Dschi, die stoßenden Finger. Dazu kommen die Holzpuppe, der Langstock und die Doppelmesser.",
"Das Herzstück im Training ist Tschi Sau, die klebenden Arme. Im ständigen Kontakt lernst du, Druck zu fühlen und sofort zu reagieren, statt zu überlegen.",
"Im G E Wing Tschun von Sifu Göksel Erdoan aus Stuttgart steht eines im Mittelpunkt: Prinzipien statt Techniksammlung. Jede Bewegung wird logisch und physikalisch erklärt. Der Lehrplan führt in acht Graden durch das ganze System.",
"Wing Tschun. Nicht nachmachen. Verstehen."]
def rd(p):
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float)/32768; w.close(); return x
segs=[]
for i,t in enumerate(TEXT):
    a=f'/tmp/_v{i}.wav'; b=f'/tmp/_v{i}r.wav'
    subprocess.run([sys.executable,'-m','piper','-m',model,'-f',a,'--length-scale','1.05','--sentence-silence','0.25','--',t],check=True,capture_output=True)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',a,'-ar',str(SR),'-ac','1',b],check=True); segs.append(rd(b))
LEAD,TAIL=.45,.45; tl=[]; t=0
for i,s in enumerate(segs):
    d=LEAD+len(s)/SR+(2.2 if i==len(segs)-1 else TAIL); tl.append({'s':round(t,3),'d':round(d,3)}); t+=d
DUR=t; n=int(DUR*SR)+1; voice=np.zeros(n)
for s,c in zip(segs,tl): i=int((c['s']+LEAD)*SR); voice[i:i+len(s)]+=s
voice/=np.abs(voice).max()
# Musik: Flaeche + gezupfte Pentatonik (Karplus-Strong)
rng=np.random.default_rng(3); mus=np.zeros(n); tt=np.arange(n)/SR
def pluck(f,d=2.2):
    N=int(SR/f); buf=rng.uniform(-1,1,N); buf=np.convolve(buf,[.5,.5],'same'); out=np.empty(int(d*SR))
    for k in range(len(out)):
        out[k]=buf[k%N]; buf[k%N]=.4985*(buf[k%N]+buf[(k+1)%N])
    return out
CH=[(110,164.81,220),(87.31,130.81,174.61),(130.81,196,261.63),(98,146.83,196)]
for k in range(int(DUR/4.8)+1):
    a=int(k*4.8*SR); m=min(int(5.4*SR),n-a); ct=np.arange(m)/SR
    env=np.clip(ct/1.2,0,1)*np.clip((5.4-ct)/1.2,0,1)
    mus[a:a+m]+=sum(np.sin(2*np.pi*f*ct)+.4*np.sin(2*np.pi*f*2.005*ct) for f in CH[k%4])*env*.05
PENT=[220,261.63,293.66,329.63,392,440,523.25]; cache={f:pluck(f) for f in PENT}; b=0.6; j=0
while b<DUR-2.5:
    if rng.random()<.72:
        f=PENT[(j*3+int(rng.integers(0,3)))%7]; p=cache[f]; a=int(b*SR); m=min(len(p),n-a); mus[a:a+m]+=p[:m]*.16
    j+=1; b+=.6
for c in tl[1:]:  # leiser Holzton am Kapitelwechsel
    a=int(c['s']*SR); ct=np.arange(int(.15*SR))/SR; mus[a:a+len(ct)]+=np.sin(2*np.pi*740*ct)*np.exp(-ct*45)*.25
mus*=np.clip(tt/1.0,0,1)*np.clip((DUR-tt)/1.8,0,1)
mix=np.tanh(voice*1.25+mus*.42); mix/=np.abs(mix).max()/.9
w=wave.open(os.path.join(here,'film.wav'),'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes()); w.close()
open(os.path.join(here,'timeline.js'),'w').write('window.TL='+json.dumps(tl)+';window.DUR='+str(round(DUR,3))+';\n')
print('Dauer',round(DUR,2),[c['d'] for c in tl])
