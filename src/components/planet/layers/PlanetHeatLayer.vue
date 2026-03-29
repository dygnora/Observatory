<template>
  <div class="layer-container" :style="{ opacity: isVisible ? intensity : 0 }">
    <div class="layer-tint heat-tint" :style="maskStyle"></div>
    <div class="layer-tint extreme-tint" :style="{...maskStyle, opacity: Math.max(0, (intensity - 0.5) * 2)}"></div>
    <!-- Dummy layer fallbacks will trigger gracefully without 404s due to early architecture fix -->
    <img v-if="assetHeavy && intensity > 0.5" :src="assetHeavy" class="layer-img" />
    <img v-else-if="assetLight" :src="assetLight" class="layer-img" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { planetAssets } from '../../../assets/map/planetAssets'

const props = defineProps({
  planet: { type: String, required: true },
  isVisible: { type: Boolean, default: false },
  intensity: { type: Number, default: 0 }
})

const assetBase = computed(() => planetAssets[props.planet]?.base)
const assetLight = computed(() => planetAssets[props.planet]?.cracksLight)
const assetHeavy = computed(() => planetAssets[props.planet]?.cracksHeavy)

// Mask image perfectly clips the backdrop-filter to the planet SVG pixels!
const maskStyle = computed(() => ({
  maskImage: `url(${assetBase.value})`,
  WebkitMaskImage: `url(${assetBase.value})`,
  maskSize: '100% 100%'
}))
</script>

<style scoped>
.layer-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 21;
  pointer-events: none;
}
.layer-img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  mix-blend-mode: multiply;
}
.layer-tint {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.heat-tint {
  backdrop-filter: sepia(0.5) hue-rotate(-20deg) saturate(2) brightness(0.9);
}
.extreme-tint {
  backdrop-filter: sepia(1) hue-rotate(-50deg) saturate(3) brightness(0.8);
  background: radial-gradient(circle, rgba(255,69,0,0.3) 0%, rgba(139,0,0,0.5) 100%);
}
</style>
