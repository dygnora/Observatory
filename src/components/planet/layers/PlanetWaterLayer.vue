<template>
  <div class="layer-container" :style="{ opacity: isVisible ? 1 : 0 }">
    <div class="layer-tint flood-tint" :style="{ ...maskStyle, opacity: intensityFlood }"></div>
    <div class="layer-tint dry-tint" :style="{ ...maskStyle, opacity: intensityDry }"></div>
    
    <img v-if="assetFlood && intensityFlood > 0" :src="assetFlood" class="layer-img" :style="{ opacity: intensityFlood }" />
    <img v-if="assetDry && intensityDry > 0" :src="assetDry" class="layer-img" :style="{ opacity: intensityDry }" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { planetAssets } from '../../../assets/map/planetAssets'

const props = defineProps({
  planet: { type: String, required: true },
  isVisible: { type: Boolean, default: false },
  intensityFlood: { type: Number, default: 0 },
  intensityDry: { type: Number, default: 0 }
})

const assetBase = computed(() => planetAssets[props.planet]?.base)
const assetFlood = computed(() => planetAssets[props.planet]?.waterFlood)
const assetDry = computed(() => planetAssets[props.planet]?.waterDry)

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
  z-index: 22;
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
.flood-tint {
  backdrop-filter: sepia(1) hue-rotate(200deg) saturate(3) brightness(0.8);
  background: radial-gradient(circle, rgba(0,105,148,0.2) 40%, rgba(0,0,128,0.5) 100%);
}
.dry-tint {
  backdrop-filter: sepia(1) hue-rotate(10deg) saturate(2) brightness(0.9);
}
</style>
