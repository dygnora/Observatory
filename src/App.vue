<template>
  <main class="app-wrapper">
    <transition name="fade" mode="out-in">
      <SolarSystem v-if="store.currentView === 'solar'" />
      <EarthView v-else />
    </transition>
  </main>
</template>

<script setup>
import { useSimulationStore } from './stores/simulation'
import SolarSystem from './components/SolarSystem.vue'
import EarthView from './components/planet/Earth/EarthView.vue'

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

/* Transisi antara SolarSystem dan EarthView */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>