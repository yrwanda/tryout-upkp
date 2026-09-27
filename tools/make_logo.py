# Membuat logo "Cap lulus" (SVG + PNG ikon PWA). Jalankan: python tools/make_logo.py (butuh pymupdf).
import io, pymupdf
import os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "icons") + "/"

def mark(detail=True):
    if detail:
        return ('<circle cx="32" cy="32" r="20" fill="none" stroke="#E6B865" stroke-width="3.5"/>'
                '<path d="M32.00 17.50A14.5 14.5 0 0 1 34.19 17.67M36.71 18.29A14.5 14.5 0 0 1 38.73 19.15M40.91 20.56A14.5 14.5 0 0 1 42.53 22.04M44.14 24.07A14.5 14.5 0 0 1 45.20 26.00M46.06 28.44A14.5 14.5 0 0 1 46.43 30.61M46.45 33.20A14.5 14.5 0 0 1 46.10 35.37M45.28 37.82A14.5 14.5 0 0 1 44.25 39.76M42.67 41.82A14.5 14.5 0 0 1 41.06 43.32M38.90 44.75A14.5 14.5 0 0 1 36.89 45.65M34.39 46.30A14.5 14.5 0 0 1 32.20 46.50M29.61 46.30A14.5 14.5 0 0 1 27.48 45.78M25.10 44.75A14.5 14.5 0 0 1 23.25 43.56M21.33 41.82A14.5 14.5 0 0 1 19.97 40.10M18.72 37.82A14.5 14.5 0 0 1 17.99 35.75M17.55 33.20A14.5 14.5 0 0 1 17.53 31.00M17.94 28.44A14.5 14.5 0 0 1 18.64 26.36M19.86 24.07A14.5 14.5 0 0 1 21.20 22.33M23.09 20.56A14.5 14.5 0 0 1 24.93 19.34M27.29 18.29A14.5 14.5 0 0 1 29.42 17.73" fill="none" stroke="#E6B865" stroke-width="1.6" stroke-linecap="butt"/>'
                '<path d="M24.5 32.5 30 38 40.5 26.5" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>')
    return ('<circle cx="32" cy="32" r="21" fill="none" stroke="#E6B865" stroke-width="5"/>'
            '<path d="M23 32.5 30 39.5 42 26" fill="none" stroke="#FFFFFF" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>')

def svg(detail=True, rounded=True, scale=1.0):
    bg = '<rect width="64" height="64" rx="15" fill="#0E5A4F"/>' if rounded else '<rect width="64" height="64" fill="#0E5A4F"/>'
    inner = mark(detail)
    if scale != 1.0:
        o = 32 * (1 - scale)
        inner = f'<g transform="translate({o:.2f} {o:.2f}) scale({scale})">{inner}</g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">{bg}{inner}</svg>'

# berkas SVG untuk halaman
io.open(R + "logo.svg", "w", encoding="utf-8").write(svg(True, True) + "\n")
io.open(R + "favicon.svg", "w", encoding="utf-8").write(svg(False, True) + "\n")

def png(markup, size, name):
    doc = pymupdf.open(stream=markup.encode(), filetype="svg")
    page = doc[0]; z = size / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(z, z), alpha=True)
    pix.save(R + name); print(name, pix.width, "x", pix.height)

png(svg(True, True), 192, "icon-192.png")
png(svg(True, True), 512, "icon-512.png")
# maskable: latar penuh, isi diperkecil agar aman dari pemotongan bulat (zona aman 80%)
png(svg(True, False, 0.82), 192, "maskable-192.png")
png(svg(True, False, 0.82), 512, "maskable-512.png")
# iOS: kotak penuh, sudut dibulatkan sistem
png(svg(True, False, 0.95), 180, "apple-touch-icon.png")
# pratinjau favicon kecil
png(svg(False, True), 32, "favicon-32.png")
