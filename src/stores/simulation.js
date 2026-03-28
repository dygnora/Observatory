import { defineStore } from 'pinia'

export const useSimulationStore = defineStore('simulation', {
  state: () => ({
    currentView: 'solar', // 'solar' | 'earth'
    
    // Default berada di titik seimbang (The Goldilocks Zone)
    distance: 50,   // 0 (Dekat) - 100 (Jauh)
    water: 50,      // 0 (Kering) - 100 (Banjir)
    atmosphere: 50  // 0 (Tipis) - 100 (Tebal)
  }),
  
  getters: {
    // 🧮 LOGIKA SUHU (Simple Model)
    temperature(state) {
      const baseTemp = 15; // Suhu ideal bumi (Celcius)
      
      // Semakin dekat (angka kecil), semakin panas. Semakin jauh, semakin dingin.
      const distanceEffect = (50 - state.distance) * 1.5; 
      
      // Atmosfer menahan panas (Greenhouse effect)
      const atmosphereEffect = (state.atmosphere - 50) * 0.5;
      
      return Math.round(baseTemp + distanceEffect + atmosphereEffect);
    },

    // 🎯 LOGIKA STATUS VISUAL
    earthCondition(state) {
      const temp = this.temperature;
      
      if (temp < -15) return 'FROZEN';
      if (temp > 50) return 'SCORCHED';
      if (state.water < 20) return 'BARREN';
      if (state.water > 80) return 'OCEANIC';
      
      return 'HABITABLE';
    }
  }
})