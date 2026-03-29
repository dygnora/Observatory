<template>
  <div class="universe">
    
    <div class="solar-system" ref="solarSystemRef">
      <!-- Sun Asset explicitly bound -->
      <img :src="getAsset({domain:'stars', name:'sun', file:'base.svg'})" alt="Matahari" class="sun-asset" ref="sunAssetRef" />

      <template v-for="planet in planets" :key="planet.id">
        
        <div class="orbit-path" :style="{ width: planet.distance + 'px', height: planet.distance + 'px' }" ref="orbitPathRefs" :data-id="planet.id"></div>

        <div 
          class="orbit-container" 
          :style="{ width: planet.distance + 'px', height: planet.distance + 'px' }"
          ref="orbitContainerRefs"
          :data-id="planet.id"
        >
          <div 
            class="planet-wrapper" 
            @click="handlePlanetClick(planet.id)"
            :class="{ 'clickable-earth': planet.id === 'earth' }"
            ref="planetWrapperRefs"
            :data-id="planet.id"
          >
            <!-- Planet Asset explicitly bound -->
            <img :src="getAsset({domain:'planets', name:planet.id, file:'base.svg'})" :alt="planet.label" class="planet-asset" :style="{ width: planet.size + 'px', height: planet.size + 'px' }" ref="planetAssetRefs" />
              
              <span class="planet-label">{{ planet.label.toUpperCase() }}</span>

              <!-- Moon System explicitly bound -->
              <div v-if="planet.id === 'earth'" class="moon-system" ref="moonSystemRefs">
                <div class="moon-orbit-path" ref="moonOrbitPathRefs"></div>
                <div class="moon-orbit-container" ref="moonOrbitRefs">
                  <div class="moon-wrapper" ref="moonWrapperRefs">
                    <img :src="getAsset({domain:'satellites', name:'moon', file:'base.svg'})" alt="Bulan" class="moon-asset" ref="moonAssetRefs" />
                  </div>
                </div>
              </div>
          </div>
        </div>

      </template>
    </div> <!-- tutup solar-system -->

    <div class="hint" ref="hintRef">[ KLIK BUMI UNTUK MASUK KE SIMULASI ]</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { useSimulationStore } from '../stores/simulation'
import { getAsset } from '../assets/assetLoader'

const store = useSimulationStore()

// 1. DOM Refs for strictly scoping GSAP
const solarSystemRef = ref(null)
const sunAssetRef = ref(null)
const hintRef = ref(null)

const orbitPathRefs = ref([])
const orbitContainerRefs = ref([])
const planetWrapperRefs = ref([])
const planetAssetRefs = ref([])

const moonSystemRefs = ref([])
const moonOrbitPathRefs = ref([])
const moonOrbitRefs = ref([])
const moonWrapperRefs = ref([])
const moonAssetRefs = ref([])

const EARTH_PERIOD = 365
const BASE_SPEED = 15

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

const handlePlanetClick = (planetId) => {
  if (planetId === 'earth') {
    // 1. Find the accurate DOM node explicitly using data-id since Vue ref arrays do not guarantee order
    const earthOrbitContainer = orbitContainerRefs.value.find(el => el.dataset.id === 'earth')
    const earthWrapper = planetWrapperRefs.value.find(el => el.dataset.id === 'earth')
    
    const moonOrbit = moonOrbitRefs.value[0]
    const moonWrapper = moonWrapperRefs.value[0]
    const moonSys = moonSystemRefs.value[0]
    const moonPath = moonOrbitPathRefs.value[0]
    const moonAsset = moonAssetRefs.value[0]
    
    // 2. Explicitly clear tweens using Refs (No String Collisions)
    gsap.killTweensOf([earthOrbitContainer, earthWrapper, moonOrbit, moonWrapper])
    
    if (earthWrapper) {
      earthWrapper.classList.remove('clickable-earth')
      earthWrapper.style.transition = 'none'
    }

    // 3. Calculation offsets based strictly on physical refs
    const ssRect = solarSystemRef.value.getBoundingClientRect()
    const eRect = earthWrapper.getBoundingClientRect()
    const originX = (eRect.left + eRect.width / 2) - ssRect.left;
    const originY = (eRect.top + eRect.height / 2) - ssRect.top;

    // 4. GPU Optimizations
    gsap.set([orbitPathRefs.value, moonPath], { borderStyle: 'solid' })
    gsap.set([moonAsset, sunAssetRef.value], { filter: 'none' })

    gsap.set(solarSystemRef.value, { 
      transformOrigin: `${originX}px ${originY}px`,
      zIndex: 9999 
    })

    // 5. Zoom Camera
    gsap.to(solarSystemRef.value, {
      scale: 100, 
      duration: 1.5,
      ease: 'power2.inOut',
      force3D: false
    })

    // 6. Fade out unfocused layers safely
    const nonEarthOrbits = orbitContainerRefs.value.filter(el => el.dataset.id !== 'earth')
    const fadeTargets = [orbitPathRefs.value, nonEarthOrbits, sunAssetRef.value, hintRef.value, moonSys]
    
    gsap.to(fadeTargets, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set([orbitPathRefs.value, nonEarthOrbits, sunAssetRef.value, moonSys], { display: 'none' })
      }
    })

    setTimeout(() => {
      store.currentView = 'earth'
    }, 1200)
  } else {
    console.log(`Simulasi untuk ${planetId} belum tersedia.`)
  }
}

onMounted(() => {
  // GSAP 100% Driven via Data Attribute Lookups inside Array Refs
  planets.forEach((planet) => {
    const duration = Math.pow(planet.period / EARTH_PERIOD, 0.5) * BASE_SPEED

    const orbitContainer = orbitContainerRefs.value.find(el => el.dataset.id === planet.id)
    const wrapper = planetWrapperRefs.value.find(el => el.dataset.id === planet.id)

    if (orbitContainer) {
      gsap.to(orbitContainer, {
        rotation: 360,
        duration: duration,
        repeat: -1,
        ease: "none"
      })
    }

    if (wrapper) {
      gsap.to(wrapper, {
        rotation: -360,
        duration: duration,
        repeat: -1,
        ease: "none"
      })
    }
  })

  // Planet spinning on axis safely
  gsap.to(planetAssetRefs.value, {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: "none"
  })

  // Moon orbit explicitly hooked
  if (moonOrbitRefs.value?.length > 0) {
    const moonDuration = Math.pow(27.3 / 365, 0.5) * BASE_SPEED;
    gsap.to(moonOrbitRefs.value[0], {
      rotation: 360,
      duration: moonDuration,
      repeat: -1,
      ease: "none"
    })
  }

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

.solar-system {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: center center;
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
  pointer-events: none;
}

.orbit-container {
  position: absolute;
  border-radius: 50%;
  display: flex;
  justify-content: flex-end; 
  align-items: center;
  pointer-events: none;
  will-change: transform;
}

.planet-wrapper {
  position: relative;
  transform: translateX(50%); 
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  pointer-events: auto;
  will-change: transform;
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

.planet-asset {
  width: 100%;
  height: 100%;
  z-index: 5;
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
  width: 80px; 
  height: 80px;
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
  border: 1px solid rgba(148, 163, 184, 0.2);
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.moon-asset {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>