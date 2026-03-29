<template>
  <div class="layer-container" :style="{ opacity: isVisible ? intensity : 0 }">
    <div class="layer-tint" :style="maskStyle"></div>
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
const assetLight = computed(() => planetAssets[props.planet]?.iceLight)
const assetHeavy = computed(() => planetAssets[props.planet]?.iceHeavy)

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
  z-index: 20;
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
.layer-tint {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: sepia(1) hue-rotate(180deg) saturate(2) brightness(1.2);
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(135,206,235,0.2) 100%);
}
</style>
