<template>
  <main class="app-container">
    <transition name="fade" mode="out-in">
      <SolarSystem v-if="currentView === 'solar'" />
      <PlanetSandbox v-else />
    </transition>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSimulationStore } from './stores/simulation'
import SolarSystem from './components/SolarSystem.vue'
import PlanetSandbox from './components/planet/PlanetSandbox.vue'

const store = useSimulationStore()
const { currentView } = storeToRefs(store)

// 1. Explicitly initialize hardware degradation flags on app mount
onMounted(() => {
  store.initDeviceProfile()
})
</script>

<style>
/* Reset Global */
body, html {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background-color: #020617;
  overflow: hidden;
  font-family: monospace;
}

.app-container {
  width: 100vw;
  height: 100vh;
}

/* Transisi Kamera Orbit <-> Sandbox */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>