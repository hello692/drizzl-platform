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
    """Remove background from an image and save as PNG with transparency."""
    path = Path(input_path)
    
    if not path.exists():
        print(f"Skipping (not found): {input_path}")
        return
    
    print(f"Processing: {input_path}")
    
    with open(path, 'rb') as f:
        input_data = f.read()
    
    output_data = remove(input_data)
    
    output_path = path.with_suffix('.png')
    
    with open(output_path, 'wb') as f:
        f.write(output_data)
    
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
