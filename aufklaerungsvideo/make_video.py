#!/usr/bin/env python3
"""30-Sekunden-Aufklaerungsvideo "Falsche Polizisten" im Pixel-Adventure-Stil.
Aufruf:  python3 make_video.py            -> falsche-polizisten.mp4
         python3 make_video.py 12.5 out.png  -> Einzelbild bei t=12.5s
Braucht: Pillow, numpy, ffmpeg."""
import math, random, subprocess, sys, wave, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
W, H, S = 384, 216, 5            # Pixel-Leinwand, Skalierung -> 1920x1080
FPS, DUR = 30, 30.0
SCENE_H = 140
FONT = os.path.join(HERE, "PixelifySans.woff")
_fonts = {}
def font(size):
    if size not in _fonts: _fonts[size] = ImageFont.truetype(FONT, size)
    return _fonts[size]

def R(d, x, y, w, h, c): d.rectangle([x, y, x + w - 1, y + h - 1], fill=c)

# ------------------------------------------------------------ Hintergrund
def build_back():
    rnd = random.Random(7)
    im = Image.new("RGB", (W, SCENE_H)); d = ImageDraw.Draw(im)
    for y in range(80):                              # Abendhimmel
        k = y / 79
        d.line([0, y, W, y], fill=(int(40 + 70 * k), int(40 + 52 * k), int(84 + 62 * k)))
    for _ in range(40):
        d.point((rnd.randrange(170, W), rnd.randrange(0, 40)), fill=(200, 200, 230))
    for x in range(170, W, 9):                       # Baeume am Horizont
        r = rnd.randrange(8, 16); y = rnd.randrange(38, 52)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(30, 54, 62))
    R(d, 170, 52, 220, 30, (30, 54, 62))
    def house(x, y, w, h, wall, roof):
        d.polygon([(x - 4, y), (x + w // 2, y - 20), (x + w + 4, y)], fill=roof)
        d.line([(x - 4, y), (x + w // 2, y - 20)], fill=(190, 96, 80))
        R(d, x + w - 14, y - 22, 5, 10, (96, 70, 70))
        R(d, x, y, w, h, wall)
        R(d, x, y, w, 2, tuple(int(c * .75) for c in wall))
        return x, y
    lit, dark = (255, 208, 96), (52, 56, 84)
    def win(x, y, on=True):
        R(d, x - 1, y - 1, 12, 12, (60, 54, 70)); R(d, x, y, 10, 10, lit if on else dark)
        R(d, x + 4, y, 1, 10, (60, 54, 70)); R(d, x, y + 4, 10, 1, (60, 54, 70))
    house(196, 44, 62, 36, (134, 134, 152), (150, 62, 54))
    win(204, 52); win(238, 52, False); R(d, 222, 62, 9, 18, (58, 44, 48))
    house(282, 40, 70, 40, (176, 166, 150), (132, 52, 48))
    win(292, 50, False); win(332, 50); win(292, 66); R(d, 314, 60, 10, 20, (70, 46, 40))
    house(362, 46, 40, 34, (120, 124, 146), (150, 62, 54)); win(368, 54)
    R(d, 0, 78, W, 3, (120, 120, 132))               # Gehweg + Strasse
    R(d, 0, 81, W, 12, (66, 66, 84))
    for x in range(176, W, 22): R(d, x, 86, 10, 1, (150, 150, 150))
    R(d, 0, 93, W, 47, (52, 108, 60))                # Rasen
    for _ in range(900):
        x, y = rnd.randrange(W), rnd.randrange(93, SCENE_H)
        d.point((x, y), fill=rnd.choice([(44, 94, 52), (66, 128, 70), (40, 86, 50)]))
    # parkendes rotes Auto
    cx, cy = 214, 70
    d.polygon([(cx + 12, cy), (cx + 40, cy), (cx + 48, cy + 8), (cx + 6, cy + 8)], fill=(150, 46, 44))
    d.polygon([(cx + 14, cy + 2), (cx + 25, cy + 2), (cx + 25, cy + 8), (cx + 10, cy + 8)], fill=(60, 70, 96))
    d.polygon([(cx + 28, cy + 2), (cx + 39, cy + 2), (cx + 44, cy + 8), (cx + 28, cy + 8)], fill=(60, 70, 96))
    R(d, cx, cy + 8, 60, 9, (170, 54, 48)); R(d, cx, cy + 15, 60, 2, (110, 34, 36))
    R(d, cx + 57, cy + 10, 3, 3, (255, 230, 150)); R(d, cx, cy + 10, 2, 3, (255, 90, 70))
    for wx in (cx + 9, cx + 44):
        d.ellipse([wx, cy + 12, wx + 8, cy + 20], fill=(24, 24, 30)); R(d, wx + 3, cy + 15, 3, 3, (130, 130, 140))
    return im

def build_hedge():
    rnd = random.Random(3)
    im = Image.new("RGBA", (W, SCENE_H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for x in range(222, W + 8, 7):
        r = rnd.randrange(8, 12)
        d.ellipse([x - r, 98 - r + rnd.randrange(4), x + r, 112], fill=(34, 84, 46))
    R(d, 216, 104, W, 30, (34, 84, 46))
    for _ in range(1300):
        x, y = rnd.randrange(214, W), rnd.randrange(92, 134)
        if im.getpixel((x, y))[3]:
            d.point((x, y), fill=rnd.choice([(46, 106, 56), (26, 66, 40), (58, 124, 62), (26, 66, 40)]))
    R(d, 216, 132, W, 2, (24, 58, 36))
    return im

def build_house():
    im = Image.new("RGBA", (W, SCENE_H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    R(d, 0, 0, 176, 120, (106, 102, 136))            # Holzfassade
    for y in range(4, 120, 7): R(d, 0, y, 176, 1, (82, 78, 112))
    for y in range(5, 120, 7): R(d, 0, y, 176, 1, (122, 118, 152))
    R(d, 172, 0, 4, 120, (72, 68, 100))
    d.polygon([(140, 0), (204, 0), (204, 6), (176, 22), (140, 22)], fill=(64, 44, 44))   # Vordach
    d.line([(140, 22), (176, 22), (204, 6)], fill=(40, 28, 30))
    R(d, 0, 116, 176, 6, (60, 58, 78))               # Sockel
    # Fenster
    R(d, 4, 34, 36, 48, (56, 48, 66)); R(d, 7, 37, 30, 42, (255, 200, 88))
    for i in range(0, 60, 9): d.line([(7 + i, 37), (7 + i - 20, 79)], fill=(255, 224, 140))
    R(d, 4, 34, 3, 48, (56, 48, 66)); R(d, 37, 34, 3, 48, (56, 48, 66)); R(d, 4, 79, 36, 3, (56, 48, 66))
    R(d, 7, 56, 30, 3, (56, 48, 66)); R(d, 2, 82, 40, 2, (132, 128, 160))
    # Tuerrahmen + Flur
    R(d, 60, 28, 78, 94, (52, 32, 30))
    R(d, 65, 33, 68, 89, (216, 146, 76))
    R(d, 65, 33, 30, 89, (198, 128, 66)); R(d, 94, 33, 1, 76, (170, 104, 56))
    R(d, 68, 56, 18, 28, (120, 72, 44)); R(d, 70, 58, 14, 24, (255, 216, 120)); R(d, 76, 58, 2, 24, (120, 72, 44)); R(d, 70, 69, 14, 2, (120, 72, 44))
    R(d, 65, 108, 68, 14, (140, 84, 48)); R(d, 65, 108, 68, 1, (110, 64, 40))
    # Stufe + Weg
    d.polygon([(58, 122), (140, 122), (240, 140), (96, 140)], fill=(150, 146, 150))
    d.polygon([(58, 122), (140, 122), (146, 124), (62, 124)], fill=(176, 172, 176))
    for p in ((90, 130), (140, 133), (170, 137), (118, 127), (200, 138)): R(d, p[0], p[1], 5, 1, (126, 122, 130))
    # Muelltonne
    R(d, 22, 98, 22, 28, (60, 62, 70)); R(d, 20, 95, 26, 4, (82, 84, 94)); R(d, 26, 102, 2, 22, (46, 48, 56)); R(d, 34, 102, 2, 22, (46, 48, 56))
    return im

def door_leaf(d, state):
    """state 0 zu, 1 halb, 2 offen"""
    br, dk, hi = (104, 62, 44), (72, 42, 32), (132, 84, 58)
    if state == 0:
        R(d, 65, 33, 68, 89, br); R(d, 65, 33, 68, 1, dk)
        for x, y, w, h in ((71, 40, 24, 30), (103, 40, 24, 30), (71, 78, 24, 36), (103, 78, 24, 36)):
            R(d, x, y, w, h, dk); R(d, x + 1, y + 1, w - 2, h - 2, hi if y < 60 else br)
        R(d, 104, 41, 22, 28, (255, 208, 96)); R(d, 126, 74, 4, 4, (230, 190, 70))
    else:
        x0, w = (133, 14) if state == 1 else (133, 30)
        d.polygon([(x0, 30), (x0 + w, 26), (x0 + w, 128), (x0, 122)], fill=br)
        d.polygon([(x0 + w - 3, 26), (x0 + w, 26), (x0 + w, 128), (x0 + w - 3, 128)], fill=dk)
        d.line([(x0, 30), (x0, 122)], fill=dk)
        if state == 2:
            R(d, x0 + 6, 40, 16, 24, dk); R(d, x0 + 8, 42, 12, 20, (255, 208, 96))
            R(d, x0 + 6, 76, 16, 40, dk); R(d, x0 + 7, 77, 14, 38, hi)
            R(d, x0 + 23, 74, 3, 5, (230, 190, 70))

# ------------------------------------------------------------ Figuren
SKIN, SKIN_S = (234, 184, 146), (204, 150, 118)

def oma(pose, talk, blink):
    im = Image.new("RGBA", (44, 56), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    ca, cb = (166, 92, 108), (216, 174, 166)
    R(d, 12, 52, 6, 3, (66, 42, 30)); R(d, 20, 52, 6, 3, (66, 42, 30))
    R(d, 13, 46, 4, 6, (196, 146, 116)); R(d, 21, 46, 4, 6, (196, 146, 116))
    R(d, 10, 34, 18, 12, (46, 52, 96)); R(d, 10, 44, 18, 2, (34, 38, 74))
    R(d, 13, 30, 12, 15, (230, 204, 146)); R(d, 13, 43, 12, 2, (200, 172, 116)); R(d, 13, 30, 12, 1, (200, 172, 116))
    for i in range(14):                                # Strickjacke
        R(d, 10, 17 + i, 18, 1, ca if (i // 2) % 2 else cb)
    R(d, 16, 17, 6, 9, (240, 240, 236)); R(d, 18, 20, 1, 1, (150, 150, 150)); R(d, 18, 23, 1, 1, (150, 150, 150))
    def sleeve(x, y, w, h):
        for i in range(h): R(d, x, y + i, w, 1, ca if ((y + i) // 2) % 2 else cb)
    if pose == "idle":
        sleeve(7, 18, 4, 12); sleeve(27, 18, 4, 12); R(d, 7, 30, 4, 3, SKIN); R(d, 27, 30, 4, 3, SKIN)
    elif pose == "shock":
        sleeve(7, 14, 4, 8); sleeve(27, 14, 4, 8); R(d, 9, 9, 4, 6, SKIN); R(d, 25, 9, 4, 6, SKIN)
    elif pose == "point":
        sleeve(7, 18, 4, 10); R(d, 6, 27, 5, 4, SKIN)
        sleeve(27, 18, 9, 4); R(d, 36, 18, 3, 4, SKIN); R(d, 39, 19, 3, 2, SKIN)
    elif pose == "phone":
        sleeve(7, 18, 4, 12); R(d, 7, 30, 4, 3, SKIN)
        sleeve(27, 14, 4, 8); R(d, 26, 8, 4, 6, SKIN); R(d, 28, 3, 3, 13, (24, 24, 30)); R(d, 26, 3, 3, 3, (24, 24, 30)); R(d, 26, 13, 3, 3, (24, 24, 30))
    R(d, 16, 14, 6, 3, SKIN_S)
    R(d, 12, 3, 14, 12, SKIN); R(d, 13, 15, 12, 1, SKIN); R(d, 12, 13, 14, 2, SKIN_S); R(d, 14, 13, 10, 2, SKIN)
    g, gl = (196, 198, 208), (232, 234, 240)           # Haare
    R(d, 10, 0, 18, 6, g); R(d, 9, 2, 4, 9, g); R(d, 25, 2, 4, 7, g); R(d, 13, -1, 12, 3, gl)
    R(d, 12, 1, 6, 2, gl); R(d, 20, 2, 5, 1, gl); R(d, 15, 5, 3, 1, g); R(d, 21, 5, 2, 1, g)
    R(d, 14, 6, 5, 5, (60, 50, 60)); R(d, 21, 6, 5, 5, (60, 50, 60)); R(d, 19, 8, 2, 1, (60, 50, 60))   # Brille
    R(d, 15, 7, 3, 3, (250, 250, 250)); R(d, 22, 7, 3, 3, (250, 250, 250))
    if blink: R(d, 15, 8, 3, 1, (40, 30, 40)); R(d, 22, 8, 3, 1, (40, 30, 40))
    else:
        ex = 1 if pose != "shock" else 0
        R(d, 16 + ex, 8, 1, 1 if pose != "shock" else 2, (20, 20, 30)); R(d, 23 + ex, 8, 1, 1 if pose != "shock" else 2, (20, 20, 30))
    if pose in ("point", "phone"): d.line([(14, 4), (18, 5)], fill=(120, 120, 130)); d.line([(21, 5), (25, 4)], fill=(120, 120, 130))
    if pose == "shock": R(d, 17, 11, 5, 4, (70, 20, 30)); R(d, 18, 13, 3, 2, (190, 70, 80))
    elif talk: R(d, 18, 12, 5, 3, (70, 20, 30)); R(d, 19, 14, 3, 1, (190, 70, 80))
    else: R(d, 18, 13, 5, 1, (120, 50, 50))
    return im

def cop(pose, talk, step=0):
    """nach rechts gezeichnet; wird fuer Blick nach links gespiegelt"""
    im = Image.new("RGBA", (48, 68), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    nv, nvh, nvd, bk = (38, 46, 92), (58, 70, 126), (26, 30, 66), (18, 18, 26)
    if pose == "run":
        a = step % 2
        if a == 0:
            d.polygon([(18, 42), (25, 42), (14, 58), (8, 56)], fill=nvd); R(d, 5, 54, 7, 4, bk)
            d.polygon([(21, 42), (28, 42), (36, 60), (30, 62)], fill=nv); R(d, 30, 60, 9, 4, bk)
        else:
            R(d, 18, 42, 6, 16, nvd); R(d, 14, 56, 7, 4, bk)
            d.polygon([(21, 42), (28, 42), (32, 52), (26, 54)], fill=nv); R(d, 26, 52, 5, 10, nv); R(d, 26, 62, 9, 4, bk)
    else:
        d.polygon([(17, 42), (24, 42), (18, 64), (12, 64)], fill=nvd); R(d, 10, 64, 9, 4, bk)
        d.polygon([(22, 42), (29, 42), (34, 64), (28, 64)], fill=nv); R(d, 28, 64, 10, 4, bk)
    R(d, 16, 23, 14, 18, nv); R(d, 26, 23, 4, 18, nvh); R(d, 16, 23, 3, 18, nvd)
    R(d, 16, 40, 14, 3, bk); R(d, 24, 40, 3, 3, (220, 190, 80))
    R(d, 23, 23, 6, 4, (130, 180, 230)); R(d, 25, 24, 2, 5, (30, 34, 60))
    R(d, 27, 29, 2, 2, (236, 200, 70))
    hair = (126, 64, 38)
    R(d, 15, 9, 6, 16, hair); R(d, 13, 14, 4, 12, hair); R(d, 14, 24, 3, 3, (98, 48, 30))
    R(d, 19, 10, 11, 12, SKIN); R(d, 19, 20, 11, 2, SKIN_S); R(d, 21, 22, 6, 2, SKIN_S)
    R(d, 19, 10, 3, 6, hair)
    R(d, 16, 3, 15, 6, nvd); R(d, 15, 6, 17, 3, nv); R(d, 24, 9, 9, 2, bk); R(d, 25, 4, 3, 3, (210, 214, 224))
    if pose in ("shock", "run"):
        R(d, 25, 12, 4, 4, (250, 250, 250)); R(d, 27, 13, 1, 2, bk); R(d, 25, 18, 4, 3, (70, 20, 30))
        R(d, 31, 9, 1, 3, (150, 210, 255)); R(d, 33, 13, 1, 2, (150, 210, 255))
    else:
        d.line([(24, 12), (28, 14)], fill=(70, 34, 24)); R(d, 26, 14, 2, 2, (250, 250, 250)); R(d, 27, 14, 1, 2, (30, 90, 50))
        if talk: R(d, 26, 18, 4, 3, (70, 20, 30))
        else: R(d, 26, 19, 4, 1, (150, 60, 60))
    if pose == "talk":
        R(d, 12, 25, 5, 9, nvd); R(d, 10, 32, 5, 4, nvd); R(d, 12, 36, 4, 3, SKIN_S)      # Hand in der Huefte
        R(d, 28, 25, 12, 5, nv); R(d, 28, 25, 12, 1, nvh); R(d, 40, 25, 4, 5, SKIN); R(d, 44, 26, 2, 2, SKIN)
        R(d, 29, 26, 3, 3, (236, 200, 70))
    elif pose == "idle":
        R(d, 12, 25, 5, 14, nvd); R(d, 12, 39, 4, 3, SKIN_S); R(d, 28, 25, 5, 14, nvh); R(d, 29, 39, 4, 3, SKIN); R(d, 29, 27, 3, 3, (236, 200, 70))
    elif pose == "shock":
        R(d, 10, 14, 5, 12, nvd); R(d, 10, 10, 4, 4, SKIN_S); R(d, 30, 14, 5, 12, nvh); R(d, 31, 10, 4, 4, SKIN)
    elif pose == "run":
        a = step % 2
        if a == 0: R(d, 28, 25, 10, 5, nvh); R(d, 38, 22, 4, 5, SKIN); R(d, 8, 27, 9, 5, nvd); R(d, 5, 29, 4, 4, SKIN_S)
        else: R(d, 28, 25, 5, 11, nvh); R(d, 29, 36, 4, 3, SKIN); R(d, 12, 25, 5, 11, nvd); R(d, 12, 36, 4, 3, SKIN_S)
    return im

def crook(mood, talk):
    im = Image.new("RGBA", (36, 34), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    hd, hl = (30, 30, 38), (52, 52, 64)
    d.ellipse([6, 0, 29, 24], fill=hd); d.polygon([(0, 34), (4, 20), (32, 20), (36, 34)], fill=hd)
    d.arc([6, 0, 29, 24], 200, 320, fill=hl); R(d, 4, 22, 10, 1, hl)
    fc, fs = (190, 142, 112), (150, 104, 84)
    R(d, 10, 8, 14, 13, fc); R(d, 20, 8, 4, 13, fs); R(d, 10, 8, 14, 2, fs); R(d, 12, 21, 10, 1, fs)
    if mood == "grin":
        d.line([(11, 11), (15, 13)], fill=(20, 20, 24)); d.line([(18, 13), (22, 11)], fill=(20, 20, 24))
        R(d, 12, 14, 3, 1, (250, 250, 250)); R(d, 18, 14, 3, 1, (250, 250, 250)); R(d, 13, 14, 1, 1, (20, 20, 24)); R(d, 19, 14, 1, 1, (20, 20, 24))
        R(d, 12, 17, 9, 2 + (1 if talk else 0), (250, 250, 250)); R(d, 14, 17, 1, 2, (150, 150, 150)); R(d, 17, 17, 1, 2, (150, 150, 150))
        R(d, 11, 16, 1, 1, (90, 50, 44)); R(d, 21, 16, 1, 1, (90, 50, 44))
    else:
        R(d, 12, 11, 3, 3, (250, 250, 250)); R(d, 18, 11, 3, 3, (250, 250, 250)); R(d, 13, 12, 1, 1, (20, 20, 24)); R(d, 19, 12, 1, 1, (20, 20, 24))
        R(d, 14, 16, 5, 4, (60, 20, 26)); R(d, 26, 6, 1, 3, (150, 210, 255))
    return im

def police_car(flash):
    im = Image.new("RGBA", (72, 30), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    sv, bl = (214, 218, 226), (36, 92, 190)
    R(d, 30, 0, 8, 3, (90, 170, 255) if flash else (30, 60, 150))
    if flash: R(d, 28, -1, 12, 1, (190, 225, 255))
    d.polygon([(18, 3), (50, 3), (58, 12), (10, 12)], fill=sv)
    d.polygon([(20, 5), (32, 5), (32, 12), (14, 12)], fill=(50, 66, 96)); d.polygon([(35, 5), (48, 5), (54, 12), (35, 12)], fill=(50, 66, 96))
    R(d, 2, 12, 68, 11, sv); R(d, 2, 15, 68, 4, bl); R(d, 2, 21, 68, 2, (150, 154, 164))
    for i, ch in enumerate("POLIZEI"): R(d, 22 + i * 4, 16, 2, 2, (240, 240, 240))
    R(d, 2, 13, 2, 3, (255, 240, 170)); R(d, 68, 13, 2, 3, (255, 80, 70))
    for wx in (10, 50):
        d.ellipse([wx, 17, wx + 10, 27], fill=(24, 24, 30)); R(d, wx + 4, 21, 3, 3, (150, 150, 160))
    return im

# ------------------------------------------------------------ Oberflaeche
def icon(d, kind, x, y):
    if kind == "telefon":
        R(d, x + 4, y + 12, 18, 9, (26, 26, 32)); R(d, x + 6, y + 10, 14, 3, (26, 26, 32))
        R(d, x + 3, y + 5, 20, 4, (40, 40, 48)); R(d, x + 3, y + 5, 5, 7, (40, 40, 48)); R(d, x + 18, y + 5, 5, 7, (40, 40, 48))
        d.ellipse([x + 9, y + 11, x + 16, y + 18], fill=(210, 210, 216)); R(d, x + 12, y + 14, 2, 2, (26, 26, 32))
    elif kind == "nudelholz":
        d.line([(x + 4, y + 21), (x + 21, y + 4)], fill=(120, 74, 44), width=2)
        d.line([(x + 8, y + 17), (x + 17, y + 8)], fill=(206, 150, 90), width=6); d.line([(x + 8, y + 15), (x + 15, y + 8)], fill=(230, 182, 120), width=1)
    elif kind == "tasche":
        R(d, x + 5, y + 11, 16, 11, (130, 76, 44)); R(d, x + 5, y + 11, 16, 2, (160, 100, 60)); R(d, x + 12, y + 14, 3, 3, (230, 190, 70))
        d.arc([x + 8, y + 4, x + 18, y + 16], 180, 360, fill=(100, 56, 34))
        R(d, x + 6, y + 7, 5, 4, (90, 190, 100)); R(d, x + 15, y + 7, 5, 4, (90, 190, 100)); R(d, x + 8, y + 8, 1, 2, (40, 120, 60)); R(d, x + 17, y + 8, 1, 2, (40, 120, 60))
    elif kind == "schluessel":
        d.ellipse([x + 4, y + 5, x + 13, y + 14], outline=(236, 200, 70), width=2)
        d.line([(x + 11, y + 12), (x + 21, y + 22)], fill=(236, 200, 70), width=2); R(d, x + 17, y + 20, 2, 3, (236, 200, 70)); R(d, x + 14, y + 17, 2, 3, (236, 200, 70))

INV = [("telefon", 274, 158), ("nudelholz", 302, 158), ("schluessel", 330, 158), ("tasche", 274, 186), (None, 302, 186), (None, 330, 186)]
OPT_Y = [158, 176, 194]
OPTIONS = ["Moment, ich hole mein Erspartes.", "Das erinnert mich doch an irgendetwas…", "Moment! Sie sind gar keine echte Polizistin!"]
VERBS = [("benutzen", 600), ("öffnen", 850), ("sprechen", 1100), ("drücken", 1365), ("ziehen", 1585)]

def build_panel():
    rnd = random.Random(5)
    im = Image.new("RGB", (W, H - SCENE_H)); d = ImageDraw.Draw(im)
    R(d, 0, 0, W, 12, (12, 12, 18)); R(d, 0, 12, W, 64, (62, 56, 42))
    for _ in range(700): d.point((rnd.randrange(W), rnd.randrange(12, 76)), fill=(54, 48, 36))
    R(d, 26, 16, 240, 56, (28, 24, 18))
    for y in OPT_Y: R(d, 28, y - SCENE_H, 236, 16, (76, 68, 50)); R(d, 28, y - SCENE_H, 236, 1, (92, 84, 64))
    for kind, x, y in INV:
        R(d, x - 1, y - 141, 28, 28, (28, 24, 18)); R(d, x, y - 140, 26, 26, (98, 86, 60)); R(d, x, y - 140, 26, 1, (118, 106, 78))
        if kind: icon(d, kind, x, y - 140)
    return im

CURSOR = ["X.......", "XX......", "XOX.....", "XOOX....", "XOOOX...", "XOOOOX..", "XOOOOOX.", "XOOXXXXX", "XOXOX...", "XX.XOX..", "X..XOX..", "....XX.."]
def draw_cursor(d, x, y):
    for j, row in enumerate(CURSOR):
        for i, ch in enumerate(row):
            if ch != ".": d.point((x + i, y + j), fill=(16, 16, 20) if ch == "X" else (245, 245, 245))

# ------------------------------------------------------------ Drehbuch
YEL, CYA, PNK, WHT = (255, 226, 64), (120, 226, 232), (255, 170, 190), (245, 245, 240)
# (start, ende, sprecher, farbe, x-mitte, y, zeilen)
LINES = [
    (2.6, 6.1, "cop", YEL, 1400, 110, ["Guten Abend, Kriminalpolizei!", "Hier sind Einbrecher", "unterwegs…"]),
    (6.3, 10.0, "cop", YEL, 1400, 110, ["…und darum müssen", "Sie mir unbedingt sofort", "all Ihr Geld mitgeben!"]),
    (10.2, 13.3, "crook", CYA, 1440, 150, ["Die Alte fällt bestimmt", "auf unsere Masche rein…"]),
    (17.2, 19.3, "oma", PNK, 600, 60, ["Moment! Sie sind gar keine", "echte Polizistin!"]),
    (19.5, 21.6, "oma", PNK, 600, 60, ["Die echte Polizei holt", "NIEMALS Geld ab!"]),
    (22.6, 24.9, "oma", PNK, 600, 60, ["Hallo, 110? Hier steht eine", "falsche Polizistin!"]),
    (23.5, 24.9, "crook", CYA, 1500, 210, ["Mist! Abhauen!"]),
]
CPS = 32
# Mauszeiger: (zeit, x, y)
CUR = [(0, 250, 200), (13.4, 250, 200), (14.1, 150, 166), (14.9, 150, 166), (15.4, 170, 184), (16.0, 170, 184),
       (16.5, 190, 202), (17.3, 190, 202), (21.2, 200, 196), (21.8, 128, 147), (22.0, 128, 147), (22.4, 288, 172), (24.0, 288, 172), (25, 330, 205), (99, 330, 205)]
T_CLICK_OPT, T_CLICK_VERB, T_CLICK_INV = 16.9, 21.95, 22.5
T_OPT_ON, T_FLEE, T_END = 13.3, 23.7, 25.3

def cursor_pos(t):
    for (t0, x0, y0), (t1, x1, y1) in zip(CUR, CUR[1:]):
        if t0 <= t <= t1:
            k = (t - t0) / (t1 - t0) if t1 > t0 else 0
            k = k * k * (3 - 2 * k)
            return x0 + (x1 - x0) * k, y0 + (y1 - y0) * k
    return CUR[-1][1:]

def speaking(t, who):
    for a, b, w, col, cx, y, lines in LINES:
        if w == who and a <= t <= b:
            n = sum(len(l) for l in lines)
            return (t - a) * CPS < n
    return False

def shadow_text(d, x, y, s, f, col, o=5):
    for dx in (-o, 0, o):
        for dy in (-o, 0, o):
            if dx or dy: d.text((x + dx, y + dy), s, font=f, fill=(10, 10, 16))
    d.text((x, y), s, font=f, fill=col)

BACK = HEDGE = HOUSE = PANEL = None
def frame(t):
    global BACK, HEDGE, HOUSE, PANEL
    if BACK is None: BACK, HEDGE, HOUSE, PANEL = build_back(), build_hedge(), build_house(), build_panel()
    sc = BACK.copy()
    flash_on = t > 23.4 and int(t * 5) % 2 == 0
    if t > 24.0:                                      # echte Polizei faehrt vor
        k = min(1, (t - 24.0) / 1.6); k = 1 - (1 - k) ** 2
        car = police_car(flash_on); sc.paste(car, (int(400 - 110 * k), 66), car)
    # Komplize hinter der Hecke
    if 9.4 < t < 26:
        up = min(1, (t - 9.4) / 0.4)
        mood = "grin" if t < 17.4 else "shock"
        cx, cy = 332, 104 - int(41 * up) + (int(t * 3) % 2 if mood == "grin" else 0)
        if t > T_FLEE: cx += int((t - T_FLEE) * 38); cy += int(t * 10) % 2 * 2
        cr = crook(mood, speaking(t, "crook") and int(t * 8) % 2); sc.paste(cr, (cx, cy), cr)
    sc.paste(HEDGE, (0, 0), HEDGE); sc.paste(HOUSE, (0, 0), HOUSE)
    d = ImageDraw.Draw(sc)
    door = 0 if t < 1.6 else (1 if t < 1.8 else 2)
    if door:
        pose = "idle" if t < 7.2 else "shock" if t < 17.0 else "point" if t < 22.5 else "phone"
        blink = pose == "idle" and (t % 2.3) < 0.12
        o = oma(pose, speaking(t, "oma") and int(t * 8) % 2, blink)
        sc.paste(o, (86, 68 + (1 if pose == "shock" and int(t * 6) % 2 else 0)), o)
    door_leaf(d, door)
    # falsche Polizistin
    if t < T_FLEE:
        pose = "idle" if t < 2.4 else "talk" if t < 17.5 else "shock"
        c = cop(pose, speaking(t, "cop") and int(t * 8) % 2).transpose(Image.FLIP_LEFT_RIGHT)
        dx = int(math.sin(t * 40) * 1.5) if 17.5 < t < 18.0 else 0
        sc.paste(c, (166 + dx, 66 + (int(t * 2.5) % 2 if pose == "talk" else 0)), c)
    else:
        k = t - T_FLEE; c = cop("run", False, int(k * 9))
        sc.paste(c, (166 + int(k * 120), 66 - int(k * 9) % 2), c)
    if flash_on:
        sc = Image.blend(sc, Image.new("RGB", sc.size, (40, 90, 255)), 0.22)
    lo = Image.new("RGB", (W, H)); lo.paste(sc, (0, 0)); lo.paste(PANEL, (0, SCENE_H))
    d = ImageDraw.Draw(lo)
    cx, cy = cursor_pos(t)
    hover = None
    if T_OPT_ON <= t < 17.15:
        for i, y in enumerate(OPT_Y):
            if y <= cy + 1 < y + 17 and cx < 264: hover = i
        if hover is not None:
            col = (150, 60, 50) if hover == 0 else (120, 108, 70)
            if hover == 2 and T_CLICK_OPT <= t: col = (236, 220, 120) if int(t * 14) % 2 else (120, 150, 70)
            R(d, 28, OPT_Y[hover], 236, 16, col)
    if T_CLICK_INV <= t < 24.6:
        R(d, 273, 157, 28, 28, (255, 226, 64)); R(d, 274, 158, 26, 26, (128, 116, 80)); icon(d, "telefon", 274, 158)
    if t < T_END + 0.6: draw_cursor(d, int(cx), int(cy))
    im = lo.resize((W * S, H * S), Image.NEAREST)
    d = ImageDraw.Draw(im); d.fontmode = "1"
    f50, f40, f60 = font(50), font(40), font(60)
    for name, x in VERBS:
        on = name == "benutzen" and 21.6 < t < 24.6
        col = YEL if on and t >= T_CLICK_VERB else (255, 255, 255) if on else (196, 190, 170)
        d.text((x - f50.getlength(name) / 2, 700), name, font=f50, fill=col)
    if T_CLICK_VERB <= t < 24.6:
        s = "Benutze Telefon" if t >= T_CLICK_INV else "Benutze …"
        shadow_text(d, 960 - f50.getlength(s) / 2, 632, s, f50, WHT, 5)
    if T_OPT_ON <= t < 17.15:
        for i, s in enumerate(OPTIONS):
            if t < T_OPT_ON + i * 0.15: continue
            y = OPT_Y[i] * S + 14
            col = (20, 20, 20) if (hover == i and i == 2 and t >= T_CLICK_OPT) else (255, 255, 255) if hover == i else (214, 208, 190)
            d.polygon([(152, y + 14), (152, y + 38), (170, y + 26)], fill=(150, 140, 110))
            d.text((186, y), s, font=f40, fill=col)
    if 0.3 < t < 2.5:
        shadow_text(d, 60, 40, "Abends. Es klingelt an der Tür…", f50, WHT)
        if 0.5 < t < 1.6:
            s = "DING" if t < 1.0 else "DING DONG"
            shadow_text(d, 760, 250, s, f60, YEL, 6)
    for a, b, who, col, cx_, y, lines in LINES:
        if a <= t <= b:
            n = int((t - a) * CPS)
            for i, l in enumerate(lines):
                x = cx_ - f60.getlength(l) / 2
                shadow_text(d, x, y + i * 72, l[:max(0, n)], f60, col, 6)
                n -= len(l)
    if t >= T_END:                                    # Abspann
        k = min(1, (t - T_END) / 0.6)
        im = Image.blend(im, Image.new("RGB", im.size, (14, 16, 40)), 0.88 * k)
        d = ImageDraw.Draw(im); d.fontmode = "1"
        if k >= 1:
            d.rectangle([40, 40, 1879, 1039], outline=(90, 150, 255), width=10)
            d.rectangle([60, 60, 1859, 1019], outline=(36, 60, 130), width=5)
            f90, f70 = font(90), font(70)
            def mid(s, y, f, col):
                shadow_text(d, 960 - f.getlength(s) / 2, y, s, f, col, 6)
            mid("Die echte Polizei holt", 150, f90, WHT)
            mid("NIEMALS", 260, font(140), YEL)
            mid("Geld oder Wertsachen ab!", 430, f90, WHT)
            tips = [("> Tür zu.", 26.6), ("> Nichts übergeben.", 27.2), ("> 110 wählen.", 27.8)]
            for i, (s, tt) in enumerate(tips):
                if t >= tt: shadow_text(d, 610, 590 + i * 95, s, f70, CYA, 6)
            if t >= 28.5 and int(t * 3) % 3: mid("Falsche Polizisten? Nicht mit mir!", 910, f60, PNK)
    return im

# ------------------------------------------------------------ Ton
SR = 44100
def tone(freq, dur, kind="sq", vol=0.2, decay=6.0, duty=0.5):
    n = int(SR * dur); tt = np.arange(n) / SR
    ph = (tt * freq) % 1.0
    if kind == "sq": w = np.where(ph < duty, 1.0, -1.0)
    elif kind == "tri": w = 4 * np.abs(ph - 0.5) - 1
    else: w = np.sin(2 * np.pi * freq * tt)
    env = np.exp(-decay * tt) * np.minimum(1, tt * 400) * np.minimum(1, (dur - tt) * 400)
    return w * env * vol

def note(n): return 440.0 * 2 ** ((n - 69) / 12)

def build_audio():
    a = np.zeros(int(SR * DUR) + SR)
    def add(t, w):
        i = int(t * SR); a[i:i + len(w)] += w[:len(a) - i]
    # Musik: erst schleichend (a-Moll), ab der richtigen Antwort froehlich (C-Dur)
    e = 0.25
    sneak_b = [45, None, 52, None, 45, None, 51, 52, 41, None, 48, None, 40, None, 47, 52]
    sneak_m = [None, 69, None, 72, None, 76, 75, None, None, 65, None, 69, None, 68, 71, None]
    t = 0.0; i = 0
    while t < 17.0:
        b, m = sneak_b[i % 16], sneak_m[i % 16]
        if b: add(t, tone(note(b), 0.2, "tri", 0.22, 9))
        if m: add(t, tone(note(m), 0.14, "sq", 0.05, 14, 0.25))
        t += e; i += 1
    happy_b = [48, 55, 52, 55, 53, 60, 57, 60, 43, 50, 47, 50, 48, 55, 52, 55]
    happy_m = [72, 76, 79, 76, 77, 81, 84, 81, 74, 79, 83, 79, 84, 79, 76, 72]
    t = 17.25; i = 0
    while t < 29.0:
        add(t, tone(note(happy_b[i % 16]), 0.22, "tri", 0.2, 7))
        add(t, tone(note(happy_m[i % 16]), 0.2, "sq", 0.055, 8, 0.25))
        t += e; i += 1
    for k, n in enumerate([72, 76, 79, 84]): add(29.0 + k * 0.08, tone(note(n), 0.9, "sq", 0.06, 3, 0.25))
    add(29.0, tone(note(48), 0.9, "tri", 0.22, 3))
    # Klingel
    add(0.5, tone(660, 0.6, "sin", 0.3, 5)); add(1.0, tone(523, 0.9, "sin", 0.3, 4))
    add(1.6, tone(90, 0.12, "sq", 0.12, 30))          # Tuer
    # Sprech-Blips
    pitch = {"cop": 420, "crook": 250, "oma": 640}
    for s, b, who, col, cx, y, lines in LINES:
        txt = "".join(lines)
        for k, ch in enumerate(txt):
            if ch != " " and k % 2 == 0:
                add(s + k / CPS, tone(pitch[who] * (1 + 0.06 * ((k * 7) % 5 - 2)), 0.035, "sq", 0.07, 30, 0.5))
    # Menue
    for tt in (14.1, 15.4, 16.5): add(tt, tone(880, 0.04, "sq", 0.08, 30))
    add(14.3, tone(110, 0.25, "sq", 0.1, 8)); add(14.3, tone(117, 0.25, "sq", 0.1, 8))    # falsche Antwort: Brummen
    for tt in (T_CLICK_OPT, T_CLICK_VERB, T_CLICK_INV):
        add(tt, tone(1320, 0.07, "sq", 0.12, 20)); add(tt + 0.07, tone(1760, 0.12, "sq", 0.12, 14))
    add(17.5, tone(160, 0.3, "sq", 0.12, 8))          # Schreck
    # Martinshorn
    t0, t1 = 23.4, 27.4; n = int((t1 - t0) * SR); tt = np.arange(n) / SR
    fr = np.where((tt // 0.7) % 2 == 0, 440.0, 587.0)
    ph = np.cumsum(fr) / SR
    w = (np.sin(2 * np.pi * ph) + 0.4 * np.sin(4 * np.pi * ph) + 0.2 * np.sin(6 * np.pi * ph))
    env = np.minimum(1, tt / 1.2) * np.minimum(1, (t1 - t0 - tt) / 1.5)
    add(t0, w * env * 0.11)
    a = np.tanh(a[:int(SR * DUR)] * 1.4)
    a[-int(SR * 0.3):] *= np.linspace(1, 0, int(SR * 0.3))
    return (a * 30000).astype(np.int16)

def main():
    if len(sys.argv) == 3:
        frame(float(sys.argv[1])).save(sys.argv[2]); return
    out = os.path.join(HERE, "falsche-polizisten.mp4")
    wav = os.path.join(HERE, "_ton.wav")
    with wave.open(wav, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes(build_audio().tobytes())
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W*S}x{H*S}",
                          "-r", str(FPS), "-i", "-", "-i", wav, "-c:v", "libx264", "-preset", "slow", "-crf", "18",
                          "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-shortest", out],
                         stdin=subprocess.PIPE)
    for i in range(int(FPS * DUR)):
        p.stdin.write(frame(i / FPS).tobytes())
    p.stdin.close(); p.wait(); os.remove(wav)
    print("fertig:", out)

if __name__ == "__main__":
    main()
