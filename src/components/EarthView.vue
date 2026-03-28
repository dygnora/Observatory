<template>
  <div class="sandbox-container">
    
    <div class="control-panel">
      <button @click="store.currentView = 'solar'" class="back-btn">← BACK TO ORBIT</button>
      
      <div class="header">
        <h2>TERRA.SIM</h2>
        <p>Planetary Sandbox v1.0</p>
      </div>

      <div class="status-board">
        <div class="metric">
          <span>TEMPERATURE</span>
          <span class="value" :class="tempColor">{{ store.temperature }}°C</span>
        </div>
        <div class="metric">
          <span>CONDITION</span>
          <span class="value status-text">{{ store.earthCondition }}</span>
        </div>
      </div>

      <div class="controls">
        <div class="control-group">
          <label>DISTANCE FROM SUN <span>{{ store.distance }}</span></label>
          <input type="range" v-model="store.distance" min="0" max="100" class="slider">
          <div class="slider-labels"><span>Near</span><span>Far</span></div>
        </div>

        <div class="control-group">
          <label>WATER LEVEL <span>{{ store.water }}</span></label>
          <input type="range" v-model="store.water" min="0" max="100" class="slider">
          <div class="slider-labels"><span>Dry</span><span>Oceanic</span></div>
        </div>

        <div class="control-group">
          <label>ATMOSPHERE <span>{{ store.atmosphere }}</span></label>
          <input type="range" v-model="store.atmosphere" min="0" max="100" class="slider">
          <div class="slider-labels"><span>Thin</span><span>Thick</span></div>
        </div>
      </div>
    </div>

    <div class="visual-panel">
      <svg viewBox="0 0 400 400" class="earth-canvas">
        <circle cx="200" cy="200" :r="160 + (store.atmosphere * 0.4)" class="atmosphere-glow" />
        
        <image 
          x="40" y="40" 
          width="320" height="320" 
          :href="getImageUrl('earth')" 
          class="earth-core-color"
          :style="{ filter: currentEarthFilter }" 
        />
      </svg>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSimulationStore } from '../stores/simulation'

const store = useSimulationStore()

// Warnai teks suhu berdasarkan angka
const tempColor = computed(() => {
  if (store.temperature > 40) return 'text-red'
  if (store.temperature < 0) return 'text-blue'
  return 'text-green'
})

// Fungsi meresolve path ke image SVG
const getImageUrl = (name) => {
  return new URL(`../assets/${name}.svg`, import.meta.url).href
}

// MAPPING FILTER BUMI BERDASARKAN STATUS
const filterMap = {
  'FROZEN': 'sepia(1) hue-rotate(180deg) saturate(2) brightness(1.2)', // Biru Es
  'SCORCHED': 'sepia(1) hue-rotate(-50deg) saturate(3) brightness(0.8)', // Merah Panas
  'BARREN': 'sepia(1) hue-rotate(10deg) saturate(2) brightness(0.9)', // Coklat Kering
  'OCEANIC': 'sepia(1) hue-rotate(200deg) saturate(3) brightness(0.8)', // Biru Laut Dalam
  'HABITABLE': 'none' // Warna Asli
}

const currentEarthFilter = computed(() => filterMap[store.earthCondition])

</script>

<style scoped>
/* LAYOUT UTAMA */
.sandbox-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #020617;
  color: #e2e8f0;
  font-family: monospace;
}

/* KIRI: CONTROL PANEL */
.control-panel {
  width: 400px;
  padding: 40px;
  background-color: rgba(15, 23, 42, 0.8);
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow-y: auto;
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

/* STATUS BOARD */
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

/* SLIDERS */
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

/* KANAN: VISUAL PANEL */
.visual-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.earth-canvas {
  width: 100%;
  max-width: 600px;
  filter: drop-shadow(0 0 50px rgba(0,0,0,0.5));
}
.atmosphere-glow {
  fill: #f8fafc;
  opacity: 0.05; /* Efek atmosfer tipis di pinggiran bumi */
  transition: r 0.3s ease; /* Animasikan besaran atmosfer */
}
.earth-core-color {
  transition: filter 1.5s ease;
}
</style>