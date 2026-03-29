<template>
  <img :src="asset" :alt="planet" class="planet-base" />
</template>

<script setup>
import { computed } from 'vue'
import { planetAssets } from '../../assets/map/planetAssets'

const props = defineProps({
  planet: { type: String, required: true }
})

const asset = computed(() => planetAssets[props.planet]?.base)
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
