# Asset Generation Prompts

AI image generation prompts for the 162 Gallery website.
Generate as PNG with transparent background unless noted otherwise.

---

## 1. Adam's Hand (Left)

**File:** `adam-hand.png`  
**Size:** ~1200 × 600px, horizontal orientation  
**Background:** Transparent

**Prompt:**
> Michelangelo's Creation of Adam, left hand and forearm only — Adam's arm extended horizontally to the right with index finger gently reaching forward, cropped just below the elbow. Renaissance fresco painting style with warm terracotta and ochre flesh tones, detailed anatomical rendering, aged fresco texture and fine craquelure cracks on the skin. Isolated on a completely transparent background. No other figures, no background, no clouds, no fabric, no text. PNG with alpha channel.

---

## 2. God's Hand (Right)

**File:** `god-hand.png`  
**Size:** ~1200 × 600px, horizontal orientation  
**Background:** Transparent

**Prompt:**
> Michelangelo's Creation of Adam, right hand and forearm only — God's arm extended horizontally to the left with index finger pointing forward and slightly downward, cropped just below the elbow. Renaissance fresco painting style with warm terracotta and ochre flesh tones, aged skin, detailed anatomical rendering, aged fresco texture and fine craquelure cracks. Isolated on a completely transparent background. No other figures, no background, no clouds, no drapery, no text. PNG with alpha channel.

---

## 3. Fresco/Plaster Background Texture

**File:** `tileable-bg.png`  
**Size:** 1024 × 1024px (seamlessly tileable)  
**Background:** N/A — this IS the background

**Prompt:**
> Seamless tileable aged fresco plaster wall texture, warm grey-beige tones (#D6CFC6 range), subtle craquelure hairline cracks like aged fresco painting, slight surface irregularity and grit. No text, no figures, no heavy staining. Flat and even enough to tile as a website background. High resolution, photorealistic.

---

## Notes on Usage

- Assets 1 & 2 are layered on top of the plaster background in the hero section
- A **subtle CSS grid overlay** (thin lines, ~6% opacity, color `#1C1C1A`) will be rendered in code — no asset needed for the grid
- The two hands animate slowly toward the center using Framer Motion; they halt with fingertips ~120px apart, website title rendered between them
