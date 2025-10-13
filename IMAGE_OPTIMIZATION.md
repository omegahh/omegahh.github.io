# Image Optimization Guide

This guide explains how to convert the images in `/imgs` directory from PNG/JPG to WebP format to reduce file size by ~75% (from 12MB to ~3MB).

## Why Optimize?

- **Current size**: `/imgs` directory is 12MB (PNG/JPG files)
- **Target size**: ~3MB (WebP format)
- **Benefit**: 75% faster page load for blog posts with images
- **Already done**: `/photos` directory already uses WebP (368KB)

## Prerequisites

### macOS
```bash
brew install webp
```

### Ubuntu/Debian
```bash
sudo apt install webp
```

### Windows
Download from: https://developers.google.com/speed/webp/download

## Conversion Process

### Option 1: Batch Convert All Images

```bash
# Navigate to your site directory
cd /Users/omega/Codes/omegahh.github.io

# Convert PNG files
for img in imgs/**/*.png imgs/*.png; do
    if [ -f "$img" ]; then
        cwebp "$img" -q 80 -o "${img%.png}.webp"
        echo "Converted: $img"
    fi
done

# Convert JPG files
for img in imgs/**/*.jpg imgs/*.jpg imgs/**/*.jpeg imgs/*.jpeg; do
    if [ -f "$img" ]; then
        output="${img%.jpg}.webp"
        output="${output%.jpeg}.webp"
        cwebp "$img" -q 80 -o "$output"
        echo "Converted: $img"
    fi
done
```

### Option 2: Convert Individual Files

```bash
# For a single file
cwebp imgs/example.png -q 80 -o imgs/example.webp

# Quality options:
# -q 80  : Good quality (recommended)
# -q 90  : Higher quality, larger file
# -q 70  : Lower quality, smaller file
```

## Update Blog Posts

After conversion, you need to update image references in your blog posts:

### Find all image references
```bash
grep -r "imgs/" _posts/
```

### Update manually
Change from:
```markdown
![Alt text](../imgs/example.png)
```

To:
```markdown
![Alt text](../imgs/example.webp)
```

### Or use batch replace (careful!)
```bash
# Backup first!
cp -r _posts _posts_backup

# Replace .png with .webp in all posts
find _posts -type f -name "*.md" -exec sed -i '' 's/\.png)/.webp)/g' {} \;
find _posts -type f -name "*.md" -exec sed -i '' 's/\.jpg)/.webp)/g' {} \;
find _posts -type f -name "*.md" -exec sed -i '' 's/\.jpeg)/.webp)/g' {} \;
```

## Verify Conversion

Check file sizes:
```bash
# Before
du -sh imgs

# After (should be ~25% of original)
du -sh imgs

# Compare specific files
ls -lh imgs/example.png
ls -lh imgs/example.webp
```

## Clean Up (Optional)

After verifying all images work, you can remove original files:

```bash
# BE CAREFUL! Only do this after thorough testing
find imgs -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -delete
```

## Browser Compatibility

WebP is supported by all modern browsers:
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (65+)
- ✅ Safari (14+)
- ✅ Opera (all versions)

For older browsers, you can use `<picture>` element with fallback:

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

## Expected Results

- **File size reduction**: ~75% (12MB → 3MB)
- **Page load improvement**: 2-3x faster for image-heavy posts
- **Bandwidth savings**: Significant for mobile users
- **SEO benefit**: Faster load times improve search rankings

## Rollback

If you kept the original files, simply revert the markdown changes:

```bash
# Restore from backup
rm -rf _posts
mv _posts_backup _posts
```
