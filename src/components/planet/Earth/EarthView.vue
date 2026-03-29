<template>
  <div class="sandbox-container">
    
    <div class="control-panel">
      <button @click="store.currentView = 'solar'" class="back-btn">← BACK TO ORBIT</button>
      
      <div class="header">
        <h2>TERRA.SIM</h2>
        <p>Planetary Sandbox v2.0</p>
      </div>

      <div class="status-board">
        <div class="metric">
          <span>TEMPERATURE</span>
          <span class="value" :class="tempColor">{{ planetState.temperature }}°C</span>
        </div>
        <div class="metric">
          <span>HABITABILITY</span>
          <span class="value status-text">{{ Math.round(planetState.habitabilityScore * 100) }}%</span>
        </div>
      </div>

      <div class="controls">
        <div class="control-group">
          <label>DISTANCE FROM SUN <span>{{ planetState.distance }}</span></label>
          <input type="range" v-model.number="store.distance" min="0" max="100" class="slider">
          <div class="slider-labels"><span>Near</span><span>Far</span></div>
        </div>

        <div class="control-group">
          <label>WATER LEVEL <span>{{ planetState.waterLevel }}</span></label>
          <input type="range" v-model.number="store.waterLevel" min="0" max="100" class="slider">
          <div class="slider-labels"><span>Dry</span><span>Oceanic</span></div>
        </div>

        <div class="control-group">
          <label>ATMOSPHERE <span>{{ planetState.atmosphereLevel }}</span></label>
          <input type="range" v-model.number="store.atmosphereLevel" min="0" max="100" class="slider">
          <div class="slider-labels"><span>Thin</span><span>Thick</span></div>
        </div>
      </div>
    </div>

    <div class="visual-panel">
      <div class="earth-wrapper">
        <PlanetBase planet="earth" />
        <PlanetLayers planet="earth" />
      </div>
      <MascotLayers />
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSimulationStore } from '../../../stores/simulation'
import PlanetBase from '../PlanetBase.vue'
import PlanetLayers from '../layers/PlanetLayers.vue'
import MascotLayers from '../../mascot/MascotLayers.vue'

const store = useSimulationStore()
const { planetState } = storeToRefs(store)

const tempColor = computed(() => {
  if (planetState.value.heatLevel === 3) return 'text-red'
  if (planetState.value.heatLevel === 0) return 'text-blue'
  return 'text-green'
})
</script>

<style scoped>
.sandbox-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #020617;
  color: #e2e8f0;
  font-family: monospace;
}

.control-panel {
  width: 400px;
  padding: 40px;
  background-color: rgba(15, 23, 42, 0.8);
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow-y: auto;
  z-index: 100;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  color: #f8fafc;
}
.header p {
  margin: 5px 0 0 0;
  color: #64748b;
}

.back-btn {
  align-self: flex-start;
  background: transparent;
  color: #94a3b8;
  border: 1px solid #334155;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
}
.back-btn:hover {
  background: #334155;
  color: white;
}

.status-board {
  background: #0f172a;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.metric .value {
  font-size: 18px;
  font-weight: bold;
}
.status-text { color: #facc15; }
.text-red { color: #ef4444; }
.text-blue { color: #60a5fa; }
.text-green { color: #22c55e; }

.controls {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.control-group label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  color: #94a3b8;
}
.slider {
  width: 100%;
  cursor: pointer;
}
.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #64748b;
  margin-top: 5px;
}

.visual-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.earth-wrapper {
  position: relative;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  filter: drop-shadow(0 0 50px rgba(0,0,0,0.5));
}
</style>
