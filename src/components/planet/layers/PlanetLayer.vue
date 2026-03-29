<template>
  <div class="layer-container" :style="{ opacity: intensity * (styleConfig.opacityBase || 1), zIndex: styleConfig.zIndex, display: intensity > 0 ? 'block' : 'none' }">
    <!-- Backdrop filter logic strictly decoupled from CSS files -->
    <div v-if="styleConfig.backdropFilter" class="layer-tint" :style="tintStyle"></div>
    
    <!-- Render raw asset safely via global registry (no v-if popping on intensity crosses) -->
    <img v-if="imageAsset" :src="imageAsset" class="layer-img" :style="imageStyle" />
    
    <!-- Edge case extensions for specific environments like Atmosphere glows (no masks) -->
    <div v-if="styleConfig.fallbackGradient" class="layer-fallback" :style="fallbackStyle"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getAsset } from '../../../assets/assetLoader'

const props = defineProps({
  domain: { type: String, required: true },
  planet: { type: String, required: true },
  imageFile: { type: String, default: null },
  intensity: { type: Number, default: 0 },
  styleConfig: { type: Object, required: true },
  maskAsset: { type: String, default: 'base.svg' }
})

// Safely resolve the primary texture
const imageAsset = computed(() => {
  if (!props.imageFile) return null;
  return getAsset({ domain: props.domain, name: props.planet, file: props.imageFile });
})

// Safely generate perfectly fitted SVG clipping bounds (No more CSS box-shadow bleeding!)
const maskStyle = computed(() => {
  if (props.styleConfig.ignoreMask) return {};
  
  const maskUrl = getAsset({ domain: props.domain, name: props.planet, file: props.maskAsset });
  if (!maskUrl) return {};

  return {
    maskImage: `url(${maskUrl})`,
    WebkitMaskImage: `url(${maskUrl})`,
    maskSize: '100% 100%'
  };
})

// Mapped directly from configuration (Dumb renderer philosophy)
const tintStyle = computed(() => ({
  ...maskStyle.value,
  backdropFilter: props.styleConfig.backdropFilter || 'none',
  background: props.styleConfig.radialGradient || 'none',
  boxShadow: props.styleConfig.boxShadow || 'none',
  mixBlendMode: props.styleConfig.blendMode || 'normal'
}))

const imageStyle = computed(() => ({
  mixBlendMode: props.styleConfig.blendMode || 'normal',
  // Decoupled raw intensity directly into element to let Vue update it instantly at 60fps
  opacity: props.styleConfig.imageFixedOpacity ? 1 : 1
}))

// For glow extensions outside the planet radius (e.g., Atmosphere bounds)
const fallbackStyle = computed(() => ({
  background: props.styleConfig.fallbackGradient,
  mixBlendMode: props.styleConfig.blendMode || 'normal',
  transform: props.styleConfig.transform || 'none'
}))
</script>

<style scoped>
.layer-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  /* Dihapus: transition CSS karena slider bekerja pada frame-dependent reactivity. Vue 3 menangani 60fps interpolasi jauh lebih baik tanpa konflik timing CSS */
}
.layer-tint, .layer-fallback, .layer-img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.layer-fallback {
  border-radius: 50%;
}
</style>
