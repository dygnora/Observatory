<template>
  <div class="mascot-layer-container">
    <MascotBase />
    <div v-if="mascotConfig.showFire(planetState)" class="mascot-effect fire-effect"></div>
    <div v-if="mascotConfig.showSweat(planetState)" class="mascot-effect sweat-effect"></div>
    <div v-if="mascotConfig.showBlush(planetState)" class="mascot-effect blush-effect"></div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useSimulationStore } from '../../stores/simulation'
import { mascotConfig } from '../planet/config/layerConfig'
import MascotBase from './MascotBase.vue'

const store = useSimulationStore()
const { planetState } = storeToRefs(store)
</script>

<style scoped>
.mascot-layer-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  z-index: 55;
  pointer-events: none;
}
.mascot-effect {
  position: absolute;
  top: -20px;
  left: 0;
  width: 100%;
  height: 100%;
}
.fire-effect {
  background: radial-gradient(circle, rgba(255,69,0,0.8) 0%, transparent 60%);
  animation: flicker 0.5s infinite alternate;
}
.sweat-effect {
  background: radial-gradient(circle at 80% 20%, rgba(135,206,235,0.9) 0%, transparent 20%);
}
.blush-effect {
  background: radial-gradient(circle at 20% 40%, rgba(255,105,180,0.7) 0%, transparent 40%),
              radial-gradient(circle at 80% 40%, rgba(255,105,180,0.7) 0%, transparent 40%);
}

@keyframes flicker {
  from { opacity: 0.8; transform: scale(1); }
  to { opacity: 1; transform: scale(1.1); }
}
</style>
