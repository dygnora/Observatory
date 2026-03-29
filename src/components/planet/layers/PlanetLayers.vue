<template>
  <div class="planet-layers-registry">
    <PlanetIceLayer 
      :planet="planet" 
      :isVisible="progressive.ice > 0" 
      :intensity="progressive.ice" 
    />
    <PlanetHeatLayer 
      :planet="planet" 
      :isVisible="progressive.heat > 0" 
      :intensity="progressive.heat" 
    />
    <PlanetWaterLayer 
      :planet="planet" 
      :isVisible="progressive.flood > 0 || progressive.dry > 0" 
      :intensityFlood="progressive.flood"
      :intensityDry="progressive.dry"
    />
    <PlanetAtmosphereLayer 
      :planet="planet" 
      :isVisible="layerConfig.atmosphere(planetState)" 
      :intensity="planetState.atmosphereLevel / 100" 
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSimulationStore } from '../../../stores/simulation'
import PlanetIceLayer from './PlanetIceLayer.vue'
import PlanetHeatLayer from './PlanetHeatLayer.vue'
import PlanetWaterLayer from './PlanetWaterLayer.vue'
import PlanetAtmosphereLayer from './PlanetAtmosphereLayer.vue'

const props = defineProps({
  planet: { type: String, required: true }
})

const store = useSimulationStore()
const { planetState } = storeToRefs(store)

const layerConfig = {
  atmosphere: (state) => state.atmosphereLevel > 0
}

// Progressive Intensity Mappings (0.0 to 1.0)
const progressive = computed(() => {
  const t = planetState.value.temperature;
  const w = planetState.value.waterLevel;
  
  // Ice: scales up as temp drops below 10C towards -40C
  const ice = t > 10 ? 0 : Math.min(1, (10 - t) / 50);
  
  // Heat: scales up as temp rises above 30C towards 80C
  const heat = t < 30 ? 0 : Math.min(1, (t - 30) / 50);
  
  // Flood: scales up as water goes above 60% towards 100%
  const flood = w < 60 ? 0 : Math.min(1, (w - 60) / 40);
  
  // Dry: scales up as water drops below 40% towards 0%
  const dry = w > 40 ? 0 : Math.min(1, (40 - w) / 40);

  return { ice, heat, flood, dry };
})
</script>

<style scoped>
.planet-layers-registry {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 15;
  pointer-events: none;
}
</style>
