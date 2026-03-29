<template>
  <div class="sandbox-container">
    
    <!-- Bagian Kiri: Antarmuka Kendali Bermain -->
    <div class="control-panel panel-bubbly">
      <button @click="store.currentView = 'solar'" class="btn-rocket">🚀 KEMBALI KE ANGKASA</button>
      
      <div class="header card-fun">
        <h2>Laboratorium {{ planetConfig.label }}!</h2>
        <p>Ayo bermain dengan alam 😎</p>
      </div>

      <div class="status-board card-fun">
        <div class="metric">
          <span>🌡️ Suhu Udara:</span>
          <span class="value badge-bubble" :class="tempColor">{{ planetState.temperature }}°C</span>
        </div>
        <div class="metric">
          <span>🌱 Kehidupan:</span>
          <span class="value badge-bubble badge-life">{{ Math.round(planetState.habitabilityScore * 100) }}%</span>
        </div>
      </div>

      <!-- Mainan Pengendali (Sliders) -->
      <div class="controls-area">
        <!-- 1. Jarak Matahari -->
        <div class="control-group card-fun slider-card">
          <label>☀️ Jarak dari Matahari <span class="badge-bubble label-val">{{ planetState.distance }}</span></label>
          <input type="range" v-model.number="store.distance" min="0" max="100" class="chunky-slider slider-orange">
          <div class="slider-labels"><span>Dekat Panas!</span><span>Jauh & Beku!</span></div>
        </div>

        <!-- 2. Perairan -->
        <div class="control-group card-fun slider-card" v-if="planetConfig.capabilities.includes('water')">
          <label>💧 Jumlah Air <span class="badge-bubble label-val">{{ planetState.waterLevel }}</span></label>
          <input type="range" v-model.number="store.waterLevel" min="0" max="100" class="chunky-slider slider-blue">
          <div class="slider-labels"><span>Kering Kerontang</span><span>Banjir Samudra</span></div>
        </div>

        <!-- 3. Atmosfer -->
        <div class="control-group card-fun slider-card" v-if="planetConfig.capabilities.includes('atmosphere')">
          <label>☁️ Ketebalan Udara <span class="badge-bubble label-val">{{ planetState.atmosphereLevel }}</span></label>
          <input type="range" v-model.number="store.atmosphereLevel" min="0" max="100" class="chunky-slider slider-cyan">
          <div class="slider-labels"><span>Tipis</span><span>Tebal Sekali</span></div>
        </div>
      </div>
    </div>

    <!-- Panggung Visual Planet & Maskot -->
    <div class="visual-panel">
      <!-- Murni Parallax Starfield CSS -->
      <div class="parallax-stars star-layer-1" :style="{ boxShadow: stars1 }"></div>
      <div class="parallax-stars star-layer-2" :style="{ boxShadow: stars2 }"></div>
      <div class="parallax-stars star-layer-3" :style="{ boxShadow: stars3 }"></div>
      
      <div class="planet-wrapper-container">
        <!-- Cermin visual planet utuh dengan reaktor baru -->
        <PlanetBase :planet="activePlanetId" />
        <PlanetLayers :planet="activePlanetId" />
      </div>
      <!-- Maskot merespons berdasarkan temperatur -->
      <MascotLayers />
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSimulationStore } from '../../stores/simulation'
import { HEAT } from '../../constants/planetState'
import { PLANET_CONFIG } from './config/planetConfig'
import PlanetBase from './PlanetBase.vue'
import PlanetLayers from './layers/PlanetLayers.vue'
import MascotLayers from '../mascot/MascotLayers.vue'

const store = useSimulationStore()
const { planetState } = storeToRefs(store)

const activePlanetId = computed(() => store.currentView !== 'solar' ? store.currentView : 'earth')
const planetConfig = computed(() => PLANET_CONFIG[activePlanetId.value] || PLANET_CONFIG.earth)

const tempColor = computed(() => {
  if (planetState.value.heatLevel === HEAT.EXTREME) return 'val-red'
  if (planetState.value.heatLevel === HEAT.COLD) return 'val-blue'
  return 'val-green'
})

// Starfield Generator murni CSS
const generateStars = (count) => {
  let shadows = [];
  for(let i=0; i<count; i++) {
    shadows.push(`${Math.floor(Math.random() * 100)}vw ${Math.floor(Math.random() * 100)}vh #fff`)
  }
  return shadows.join(', ')
}

const stars1 = generateStars(150)
const stars2 = generateStars(100)
const stars3 = generateStars(50)
</script>

<style>
/* Kami menyuntikkan font Google Nunito secara global untuk proyek edukasi ini */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap');
</style>

<style scoped>
.sandbox-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1e1b4b 0%, #020617 100%);
  color: #334155;
  font-family: 'Nunito', system-ui, sans-serif;
  overflow: hidden;
}

/* Panel Biru Langit Ceria di Pinggir */
.panel-bubbly {
  width: 440px;
  padding: 30px;
  background: #f0f9ff;
  border-right: 8px solid #bae6fd;
  border-radius: 0 40px 40px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 10px 0 30px rgba(0,0,0,0.4);
}

.card-fun {
  background: white;
  padding: 20px;
  border-radius: 24px;
  box-shadow: 0 10px 0 #e2e8f0;
  border: 4px solid #cbd5e1;
}

/* Judul Laboratorium */
.header {
  text-align: center;
  border-color: #fca5a5;
  box-shadow: 0 8px 0 #fecaca;
}
.header h2 { 
  margin: 0; 
  font-size: 28px; 
  font-weight: 800;
  color: #ea580c; 
}
.header p { 
  margin: 8px 0 0 0; 
  font-weight: 700;
  color: #64748b; 
}

/* Tombol Balik Roket */
.btn-rocket {
  align-self: center;
  background: #f59e0b;
  color: white;
  border: 4px solid #b45309;
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 800;
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
  box-shadow: 0 6px 0 #b45309;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-rocket:hover { 
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 10px 0 #b45309;
}
.btn-rocket:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 #b45309;
}

/* Papan Status */
.status-board {
  border-color: #bef264;
  box-shadow: 0 8px 0 #d9f99d;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.metric { 
  display: flex; justify-content: space-between; align-items: center; 
  font-size: 18px; font-weight: 800; color: #475569;
}
.badge-bubble {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 18px;
  border: 3px solid;
}
.badge-life { background: #d9f99d; color: #4d7c0f; border-color: #84cc16; }
.val-red { background: #fee2e2; color: #b91c1c; border-color: #ef4444; }
.val-blue { background: #e0f2fe; color: #0369a1; border-color: #38bdf8; }
.val-green { background: #dcfce7; color: #15803d; border-color: #4ade80; }

/* SLIDER MAINAN (Chunky Sliders) */
.controls-area { display: flex; flex-direction: column; gap: 20px; }
.slider-card {
  padding: 15px 20px;
  border-color: #cbd5e1;
  box-shadow: 0 8px 0 #e2e8f0;
}
.slider-card label { 
  display: flex; justify-content: space-between; align-items: center;
  font-size: 16px; font-weight: 800; color: #334155; margin-bottom: 12px;
}
.label-val { font-size: 14px; padding: 4px 10px; border-width: 2px; border-color: #94a3b8; background: #f1f5f9; color: #475569; }

.chunky-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 24px;
  border-radius: 12px;
  outline: none;
  margin: 10px 0;
  cursor: grab;
}
.chunky-slider:active { cursor: grabbing; }

/* Kustomisasi Thumb (Tuas) untuk Webkit */
.chunky-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: grab;
  border: 4px solid;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}
.chunky-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
.chunky-slider::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(0.9); }

/* Varian Warna Slider */
.slider-orange { background: #ffedd5; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
.slider-orange::-webkit-slider-thumb { background: #fb923c; border-color: #c2410c; }

.slider-blue { background: #e0f2fe; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
.slider-blue::-webkit-slider-thumb { background: #38bdf8; border-color: #0369a1; }

.slider-cyan { background: #ecfeff; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
.slider-cyan::-webkit-slider-thumb { background: #22d3ee; border-color: #0891b2; }

.slider-labels { 
  display: flex; justify-content: space-between; 
  font-size: 12px; font-weight: 700; color: #94a3b8; margin-top: 8px; 
}

/* Panel Antariksa & Parallax Stars */
.visual-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.parallax-stars {
  position: absolute;
  top: 0; left: 0;
  border-radius: 50%;
  background: transparent;
}
.parallax-stars::after {
  content: "";
  position: absolute;
  top: 100vh;
  left: 0;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  background: transparent;
  box-shadow: inherit;
}

.star-layer-1 {
  width: 1px; height: 1px;
  animation: parallax-anim 50s linear infinite;
  opacity: 0.5;
}
.star-layer-2 {
  width: 2px; height: 2px;
  animation: parallax-anim 75s linear infinite;
  opacity: 0.7;
}
.star-layer-3 {
  width: 3px; height: 3px;
  animation: parallax-anim 100s linear infinite;
  opacity: 0.9;
}

@keyframes parallax-anim {
  from { transform: translateY(0); }
  to { transform: translateY(-100vh); }
}

.planet-wrapper-container {
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: drop-shadow(0 0 60px rgba(129, 140, 248, 0.4));
  animation: float-planet 6s ease-in-out infinite alternate-reverse;
}

@keyframes float-planet {
  0% { transform: translateY(0); }
  100% { transform: translateY(-10px); }
}
</style>
