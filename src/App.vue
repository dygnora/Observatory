<template>
  <main class="app-wrapper">
    <SolarSystem v-if="store.currentView === 'solar'" />
    <EarthView v-else />
  </main>
</template>

<script setup>
import { useSimulationStore } from './stores/simulation'
import SolarSystem from './components/SolarSystem.vue'
import EarthView from './components/EarthView.vue'

const store = useSimulationStore()
</script>

<style>
/* CSS Global agar background hitam dan full screen */
body {
  margin: 0;
  padding: 0;
  background-color: #020617; /* Warna gelap angkasa */
  color: white;
  overflow: hidden; /* Mencegah scroll */
}
.app-wrapper {
  width: 100vw;
  height: 100vh;
}
</style>