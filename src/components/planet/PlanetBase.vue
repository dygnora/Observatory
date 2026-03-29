<template>
  <img :src="asset" :alt="planet" class="planet-base" />
</template>

<script setup>
import { computed } from 'vue'
import { getAsset } from '../../assets/assetLoader'
import { PLANET_CONFIG } from './config/planetConfig'

const props = defineProps({
  planet: { type: String, required: true }
})

const asset = computed(() => {
  const domain = PLANET_CONFIG[props.planet]?.domain || 'planets'
  return getAsset({ domain, name: props.planet, file: 'base.svg' })
})
</script>

<style scoped>
.planet-base {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  pointer-events: none;
}
</style>
