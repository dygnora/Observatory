<template>
  <div class="layer-container" :style="{ opacity: isVisible ? (intensity * 0.5) : 0 }">
    <img :src="assetAtmosphere" class="layer-img" />
    <div class="layer-fallback" :style="{ opacity: intensity }"></div>
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

const assetAtmosphere = computed(() => planetAssets[props.planet]?.atmosphere)
</script>

<style scoped>
.layer-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 23;
  transition: opacity 1s ease;
  pointer-events: none;
}
.layer-img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  mix-blend-mode: screen;
}
.layer-fallback {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0) 60%, rgba(200,230,255,0.6) 100%);
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(1.1);
  mix-blend-mode: screen;
}
</style>
