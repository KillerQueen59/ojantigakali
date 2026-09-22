from PIL import Image, ImageFilter, ImageEnhance
import os

SRC = r'c:/Users/Fauzan/Desktop/me.jpg'
im = Image.open(SRC).convert('RGB')
# tight bust crop (head -> chest)
crop = im.crop((425, 285, 725, 745))   # 300 x 460
AW, AH = 60, 92                          # art resolution
base = crop.resize((AW, AH), Image.BOX)  # area sampling

# subject pop: a little more contrast + saturation, slight sharpen
base = ImageEnhance.Color(base).enhance(1.15)
base = ImageEnhance.Contrast(base).enhance(1.10)
base = base.filter(ImageFilter.UnsharpMask(radius=1, percent=70, threshold=2))

# clean background with median, but keep face + shirt graphics crisp
FACE = (12, 2, 43, 30)
CHEST = (11, 34, 42, 55)   # PONY, crest, hp / HEWLETT PACKARD block
face = base.crop(FACE)
face = ImageEnhance.Contrast(face).enhance(1.28)
face = ImageEnhance.Color(face).enhance(1.08)
chest = base.crop(CHEST)
chest = ImageEnhance.Contrast(chest).enhance(1.22)
smooth = base.filter(ImageFilter.MedianFilter(3))
smooth.paste(face, (FACE[0], FACE[1]))
smooth.paste(chest, (CHEST[0], CHEST[1]))
base = smooth

# flatten to a limited palette (keep enough colors so the small face survives)
q = base.convert('P', palette=Image.ADAPTIVE, colors=30).convert('RGB')
q.save('refine_base.png')
# big ruler view to locate facial features on the 60x92 grid
RS = 9
ruler = q.resize((AW*RS, AH*RS), Image.NEAREST).convert('RGB')
rp = ruler.load()
for gx in range(0, AW, 5):
    for y in range(AH*RS):
        rp[gx*RS, y] = (255,0,0)
for gy in range(0, AH, 5):
    for x in range(AW*RS):
        rp[x, gy*RS] = (255,0,0)
ruler.save('refine_ruler.png')

# ---- frame (pixel-style wood) at art resolution ----
FT = 4  # frame thickness each side
FW, FH = AW + FT*2, AH + FT*2
wood_d, wood_m, wood_l, mat = (61,38,18), (107,68,35), (145,96,51), (239,231,214)
canvas = Image.new('RGB', (FW, FH), wood_m)
px = canvas.load()
for y in range(FH):
    for x in range(FW):
        # ring distance from nearest edge
        d = min(x, y, FW-1-x, FH-1-y)
        if d == 0:
            px[x, y] = wood_d
        elif d == 1 or d == 2:
            # bevel: lighter on top/left, darker on bottom/right
            if x < FW-1-x and y < FH-1-y:
                px[x, y] = wood_l
            else:
                px[x, y] = wood_d if d == 2 else wood_m
        elif d == 3:
            px[x, y] = mat
canvas.paste(q, (FT, FT))

canvas.save('me_pixel_artres.png')   # true-resolution editable source (68x100)
SCALE = 10
out = canvas.resize((FW*SCALE, FH*SCALE), Image.NEAREST)
out.save('refine_framed.png')
print('art', AW, 'x', AH, ' framed', FW, 'x', FH, ' out', out.size)
