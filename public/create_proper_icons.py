#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Create image with dark blue background
    img = Image.new('RGB', (size, size), color='#0a1929')
    draw = ImageDraw.Draw(img)
    
    # Try to use a font, fallback to default
    try:
        font_size = size // 3
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Draw "A" in center
    text = "A"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size - text_width) // 2, (size - text_height) // 2)
    
    draw.text(position, text, fill='#ffffff', font=font)
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

create_icon(192, 'icon-192.png')
create_icon(512, 'icon-512.png')
