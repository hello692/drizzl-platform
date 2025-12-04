#!/usr/bin/env python3
"""
Remove backgrounds from product images and save as transparent PNGs.
"""

import os
from pathlib import Path
from rembg import remove
from PIL import Image
import io

IMAGES_TO_PROCESS = [
    "public/products/strawberry-peach/main-product.png",
    "public/products/strawberry-peach/transparent-glass-1.jpg",
    "public/products/strawberry-peach/transparent-glass-2.jpg",
    "public/products/strawberry-peach/transparent-glass-3.jpg",
    "public/products/strawberry-banana-protein/transparent-glass-1.jpg",
    "public/products/strawberry-banana-protein/transparent-glass-2.jpg",
    "public/products/strawberry-banana-protein/transparent-glass-3.jpg",
]

def remove_background(input_path: str) -> None:
    """Remove background from an image and save as PNG with white background."""
    path = Path(input_path)
    
    if not path.exists():
        print(f"Skipping (not found): {input_path}")
        return
    
    print(f"Processing: {input_path}")
    
    with open(path, 'rb') as f:
        input_data = f.read()
    
    output_data = remove(input_data)
    
    foreground = Image.open(io.BytesIO(output_data)).convert("RGBA")
    
    white_background = Image.new("RGBA", foreground.size, (255, 255, 255, 255))
    
    composite = Image.alpha_composite(white_background, foreground)
    
    final_image = composite.convert("RGB")
    
    output_path = path.with_suffix('.png')
    
    final_image.save(output_path, "PNG")
    
    print(f"Saved: {output_path}")
    
    if path.suffix.lower() in ['.jpg', '.jpeg'] and path != output_path:
        os.remove(path)
        print(f"Removed original: {path}")

def main():
    print("=" * 50)
    print("Background Removal Script")
    print("=" * 50)
    
    for image_path in IMAGES_TO_PROCESS:
        try:
            remove_background(image_path)
        except Exception as e:
            print(f"Error processing {image_path}: {e}")
    
    print("\n" + "=" * 50)
    print("Done! All images processed.")
    print("=" * 50)

if __name__ == "__main__":
    main()
