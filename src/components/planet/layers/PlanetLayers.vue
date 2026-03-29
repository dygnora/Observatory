<template>
  <div class="planet-layers-registry">
    <!-- ============================== -->
    <!-- PARALLEL VERIFICATION TOGGLE   -->
    <!-- Flag: Set to false to see old implementation -->
    <!-- ============================== -->
    
    <template v-if="!useNewEngine">
      <PlanetIceLayer :planet="planet" :isVisible="progressive.ice > 0" :intensity="progressive.ice" />
      <PlanetHeatLayer :planet="planet" :isVisible="progressive.heat > 0" :intensity="progressive.heat" />
      <PlanetWaterLayer :planet="planet" :isVisible="progressive.flood > 0 || progressive.dry > 0" :intensityFlood="progressive.flood" :intensityDry="progressive.dry" />
      <PlanetAtmosphereLayer :planet="planet" :isVisible="true" :intensity="planetState.atmosphereLevel / 100" />
    </template>
    
    <template v-else>
      <!-- NEW STRICT GENERIC ENGINE -->
      <PlanetLayer 
        v-for="layer in newActiveLayers"
        :key="layer.id"
        :domain="planetConfig.domain"
        :planet="planetConfig.name"
        :imageFile="layer.imageFile"
        :intensity="layer.intensity"
        :styleConfig="layer.styleConfig"
        :maskAsset="'base.svg'"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSimulationStore } from '../../../stores/simulation'
import { PLANET_CONFIG } from '../config/planetConfig'
import { getActiveLayers } from '../config/layerConfig'

// OLD COMPONENTS (DEPRECATED - Kept for visual regression)
import PlanetIceLayer from './PlanetIceLayer.vue'
import PlanetHeatLayer from './PlanetHeatLayer.vue'
import PlanetWaterLayer from './PlanetWaterLayer.vue'
import PlanetAtmosphereLayer from './PlanetAtmosphereLayer.vue'

// NEW COMPONENT
import PlanetLayer from './PlanetLayer.vue'

const props = defineProps({
  planet: { type: String, required: true }
})

const store = useSimulationStore()
const { planetState, isLowDevice } = storeToRefs(store)

// Toggle for parallel verification
const useNewEngine = true

const planetConfig = computed(() => {
  return PLANET_CONFIG[props.planet] || PLANET_CONFIG.earth;
})

const progressive = computed(() => {
  const t = planetState.value.temperature;
  const w = planetState.value.waterLevel;
  
  const ice = t > 10 ? 0 : Math.min(1, (10 - t) / 50);
  const heat = t < 30 ? 0 : Math.min(1, (t - 30) / 50);
  const flood = w < 60 ? 0 : Math.min(1, (w - 60) / 40);
  const dry = w > 40 ? 0 : Math.min(1, (40 - w) / 40);

  return { ice, heat, flood, dry };
})

const newActiveLayers = computed(() => {
  // If performance fallback triggers, we can filter heavy backdrop/mask layers here!
  let layers = getActiveLayers(planetState.value, progressive.value);
  
  // Performance logic:
  if (isLowDevice.value) {
     // Strip heavy CSS filters on low-end devices
    layers = layers.map(l => ({ ...l, styleConfig: { ...l.styleConfig, backdropFilter: 'none', boxShadow: 'none' }}));
  }
  
  return layers;
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
