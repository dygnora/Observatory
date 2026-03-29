<template>
  <div class="universe">
    
    <img src="../assets/sun.svg" alt="Matahari" class="sun-asset" />

    <template v-for="planet in planets" :key="planet.id">
      
      <div class="orbit-path" :style="{ width: planet.distance + 'px', height: planet.distance + 'px' }"></div>

      <div 
        class="orbit-container" 
        :id="'orbit-' + planet.id"
        :style="{ width: planet.distance + 'px', height: planet.distance + 'px' }"
      >
        <div 
          class="planet-wrapper" 
          :id="'wrapper-' + planet.id"
          @click="handlePlanetClick(planet.id)"
          :class="{ 'clickable-earth': planet.id === 'earth' }"
        >
          <img 
            :src="getImageUrl(planet.id)" 
            :alt="planet.label" 
            class="planet-asset"
            :style="{ width: planet.size + 'px', height: planet.size + 'px' }"
          />

          <!-- Tampilkan bulan jika planet adalah Bumi -->
          <template v-if="planet.id === 'earth'">
            <div class="moon-system">
              <div class="moon-orbit-path"></div>
              <div class="moon-orbit-container" id="orbit-moon">
                <div class="moon-wrapper" id="wrapper-moon">
                  <img src="../assets/moon.svg" alt="Bulan" class="moon-asset" />
                </div>
              </div>
            </div>
          </template>

          <span class="planet-label">{{ planet.label.toUpperCase() }}</span>
        </div>
      </div>

    </template>

    <div class="hint">[ KLIK BUMI UNTUK MASUK KE SIMULASI ]</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'
import { useSimulationStore } from '../stores/simulation'

const store = useSimulationStore()

// Fungsi untuk meload image SVG
const getImageUrl = (name) => {
  return new URL(`../assets/${name}.svg`, import.meta.url).href
}

// INI FUNGSI YANG HILANG SEBELUMNYA
const handlePlanetClick = (planetId) => {
  if (planetId === 'earth') {
    // Hentikan animasi rotasi Bumi dan Bulan agar menghemat resource komputasi saat scaling
    gsap.killTweensOf('#orbit-earth, #wrapper-earth, #orbit-moon, #wrapper-moon')

    // Hapus transisi dan class hover agar tidak bentrok dan memaksa rendering ulang CSS
    const earthWrapper = document.getElementById('wrapper-earth')
    if (earthWrapper) {
      earthWrapper.style.transition = 'none'
      earthWrapper.classList.remove('clickable-earth')
    }

    // OPTIMASI: Sembunyikan properti CSS yang sangat berat dirender ketika discale ratusan kali
    gsap.set('.moon-orbit-path', { display: 'none' }) // dashed border
    gsap.set('.moon-asset', { filter: 'none' })      // drop-shadow

    // Posisikan Bumi di atas & beri will-change agar browser merender lewat texture GPU
    gsap.set('#wrapper-earth', { zIndex: 9999, willChange: 'transform' })

    // Animasikan Bumi membesar drastis (Zoom in)
    gsap.to('#wrapper-earth', {
      scale: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      force3D: true // Paksa akselerasi GPU
    })

    // Pudarkan elemen tata surya yang lainnya dengan durasi lebih cepat
    gsap.to('.orbit-path, .orbit-container:not(#orbit-earth), .sun-asset, .hint, .moon-system', {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    })

    // Pindah ke simulator setelah animasi zoom hampir selesai
    setTimeout(() => {
      store.currentView = 'earth'
    }, 1200)
  } else {
    console.log(`Simulasi untuk ${planetId} belum tersedia.`)
  }
}

const EARTH_PERIOD = 365
const BASE_SPEED = 15

// Data planet: 'id' untuk nama file, 'label' untuk teks tampilan
const planets = [
  { id: 'mercury', label: 'Merkurius', distance: 140, size: 20, period: 88 },
  { id: 'venus', label: 'Venus', distance: 220, size: 30, period: 225 },
  { id: 'earth', label: 'Bumi', distance: 300, size: 35, period: 365 },
  { id: 'mars', label: 'Mars', distance: 380, size: 25, period: 687 },
  { id: 'jupiter', label: 'Jupiter', distance: 540, size: 70, period: 4333 },
  { id: 'saturn', label: 'Saturnus', distance: 680, size: 65, period: 10759 },
  { id: 'uranus', label: 'Uranus', distance: 800, size: 45, period: 30687 },
  { id: 'neptune', label: 'Neptunus', distance: 920, size: 40, period: 60190 }
]

onMounted(() => {
  planets.forEach((planet) => {
    const duration = Math.pow(planet.period / EARTH_PERIOD, 0.5) * BASE_SPEED

    gsap.to(`#orbit-${planet.id}`, {
      rotation: 360,
      duration: duration,
      repeat: -1,
      ease: "none"
    })

    gsap.to(`#wrapper-${planet.id}`, {
      rotation: -360,
      duration: duration,
      repeat: -1,
      ease: "none"
    })
  })

  // Animasikan satelit (Bulan) mengelilingi bumi
  // Periode bulan jauh lebih cepat (sekitar 27 hari), kita gunakan proporsi logis
  const moonDuration = Math.pow(27.3 / 365, 0.5) * BASE_SPEED;

  gsap.to('#orbit-moon', {
    rotation: 360,
    duration: moonDuration,
    repeat: -1,
    ease: "none"
  })

  gsap.to('#wrapper-moon', {
    rotation: -360,
    duration: moonDuration,
    repeat: -1,
    ease: "none"
  })
})
</script>

<style scoped>
.universe {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.sun-asset {
  position: absolute;
  width: 80px;
  height: 80px;
  z-index: 10;
  filter: drop-shadow(0 0 40px rgba(251, 191, 36, 0.5));
}

.orbit-path {
  position: absolute;
  border: 1px dashed rgba(51, 65, 85, 0.5); 
  border-radius: 50%;
  pointer-events: none; /* Izinkan pointer tembus ke Bumi */
}

.orbit-container {
  position: absolute;
  border-radius: 50%;
  display: flex;
  justify-content: flex-end; 
  align-items: center;
  pointer-events: none; /* Cegah orbit besar menutupi klik */
}

.planet-wrapper {
  position: relative;
  transform: translateX(50%); 
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  pointer-events: auto; /* Izinkan klik khusus di planet */
}

.clickable-earth {
  cursor: pointer;
  transition: transform 0.2s ease;
}
.clickable-earth:hover {
  transform: translateX(50%) scale(1.3);
}
.clickable-earth .planet-label {
  color: #60a5fa; 
  border: 1px solid #60a5fa;
}

.planet-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  color: #94a3b8;
  font-family: monospace;
  font-size: 10px;
  background: rgba(0,0,0,0.7);
  padding: 2px 6px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
}

.planet-wrapper:hover .planet-label {
  opacity: 1;
}

.hint {
  position: absolute;
  bottom: 30px;
  color: #64748b;
  font-family: monospace;
  font-size: 14px;
  z-index: 100;
  background-color: rgba(2, 6, 23, 0.8);
  padding: 8px 16px;
  border-radius: 8px;
}

.moon-system {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: -1;
}

.moon-orbit-path {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px dashed rgba(148, 163, 184, 0.4);
  border-radius: 50%;
}

.moon-orbit-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.moon-wrapper {
  position: relative;
  transform: translateX(50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.moon-asset {
  width: 8px;
  height: 8px;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3));
}
</style>