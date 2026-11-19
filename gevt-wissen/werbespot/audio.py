import numpy as np, wave, sys
SR=44100; DUR=32.0; n=int(SR*DUR); L=np.zeros(n); R=np.zeros(n); rng=np.random.default_rng(7)
def add(sig,t,g=1.0,pan=0.0):
    i=int(t*SR); m=min(len(sig),n-i)
    if m<=0: return
    L[i:i+m]+=sig[:m]*g*(1-max(0,pan)); R[i:i+m]+=sig[:m]*g*(1+min(0,pan))
def kick(d=.35,f0=110,f1=42):
    t=np.arange(int(d*SR))/SR; f=f1+(f0-f1)*np.exp(-t*28); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)
def boom(d=1.6):
    t=np.arange(int(d*SR))/SR; f=34+70*np.exp(-t*14)
    x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*3.2); nz=rng.standard_normal(len(t))*np.exp(-t*30)*.6
    return np.tanh((x+nz)*1.8)
def wood(f=820,d=.12):
    t=np.arange(int(d*SR))/SR; return (np.sin(2*np.pi*f*t)+.5*np.sin(2*np.pi*f*2.71*t))*np.exp(-t*55)
def tick(d=.03):
    t=np.arange(int(d*SR))/SR; return rng.standard_normal(len(t))*np.exp(-t*200)
def lp(x,k):
    c=np.cumsum(np.insert(x,0,0)); return (c[k:]-c[:-k])/k
tt=np.arange(n)/SR
# Drone
dr=(np.sin(2*np.pi*55*tt)+.5*np.sin(2*np.pi*55.4*tt)+.25*np.sin(2*np.pi*110.3*tt))*(.6+.4*np.sin(2*np.pi*.11*tt))
env=np.clip(tt/2,0,1)*np.clip((DUR-tt)/1.5,0,1); env[(tt>19.9)&(tt<23.2)]*=.25
L+=dr*.10*env; R+=dr*.10*env
# Herzschlag im Hook
for b in (.3,.8,1.3): add(boom(1.0),b,.55)
add(kick(.5,80,36),2.3,.7)
# Technik-Flut: beschleunigende Ticks + Riser
t=3.2; gap=.16
while t<4.78: add(tick(),t,.35,pan=rng.uniform(-.6,.6)); add(wood(600+rng.uniform(0,900),.05),t,.12); gap=max(.022,gap*.9); t+=gap
rz=lp(rng.standard_normal(int(1.6*SR)+40),6)[:int(1.6*SR)]; rt=np.arange(len(rz))/SR; add(rz*(rt/1.6)**3,3.2,.5)
# große Einschläge an Schnitten
for b,gn in ((4.8,1.0),(7.0,.8),(11.2,.7),(12.9,.9),(15.4,.7),(19.6,.8),(23.2,.8),(24.7,1.0),(26.8,1.0)): add(boom(),b,gn)
# Puls 100 BPM, Holz auf Offbeats
b=7.0
while b<26.7:
    if not (19.9<b<23.1):
        add(kick(),b,.6)
        if b>=11.2: add(wood(820 if int(round((b-7)/.6))%2 else 1100),b+.3,.22,pan=.4 if int(round((b-7)/.6))%2 else -.4)
        if b>=15.4: add(tick(.02),b+.15,.12); add(tick(.02),b+.45,.12)
    b+=.6
# Wut -> Ruhe: Rauschen klingt ab
m=int(2.1*SR); wz=rng.standard_normal(m)*np.linspace(1,0,m)**2; add(np.tanh(wz*2)*.9,19.7,.3)
add(wood(660,.5),21.7,.35)
# Endcard-Akkord
m=int(5.2*SR); ct=np.arange(m)/SR; ch=sum(np.sin(2*np.pi*fq*ct)+.5*np.sin(2*np.pi*fq*1.003*ct) for fq in (110,164.81,220,329.63))
add(ch*np.clip(ct/.05,0,1)*np.exp(-ct*.55)*np.clip((5.2-ct)/1.2,0,1),26.8,.07)
add(wood(1100,.2),30.0,.3); add(kick(.5,90,38),30.0,.7)
s=np.stack([L,R],1); s=np.tanh(s*1.3); s/=np.abs(s).max()/.92
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((s*32767).astype('<i2').tobytes()); w.close()
