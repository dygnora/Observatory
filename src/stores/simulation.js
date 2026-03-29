import { defineStore } from 'pinia'

export const useSimulationStore = defineStore('simulation', {
  state: () => ({
    currentView: 'solar', // 'solar' | 'earth'
    
    // Default berada di titik seimbang (The Goldilocks Zone)
    distance: 50,       // 0 (Dekat) - 100 (Jauh)
    waterLevel: 50,     // 0 (Kering) - 100 (Banjir)
    atmosphereLevel: 50 // 0 (Tipis) - 100 (Tebal)
  }),
  
  getters: {
    // 🧮 LOGIKA SUHU (Dipertahankan sebagai angka suhu murni)
    temperature(state) {
      const baseTemp = 15; 
      const distanceEffect = (50 - state.distance) * 1.5; 
      const atmosphereEffect = (state.atmosphereLevel - 50) * 0.5;
      return Math.round(baseTemp + distanceEffect + atmosphereEffect);
    },

    // 🎯 LOGIKA SINGLE SOURCE OF TRUTH FINAL (Dari skill.md)
    planetState(state) {
      const temp = this.temperature;

      // 1. Heat Level (0: cold, 1: normal, 2: hot, 3: extreme)
      let heatLevel = 1;
      if (temp < -15) heatLevel = 0;
      else if (temp > 60) heatLevel = 3;
      else if (temp > 40) heatLevel = 2;

      // 2. Water State (0: dry, 1: balanced, 2: flooded)
      let waterState = 1;
      if (state.waterLevel < 20) waterState = 0;
      else if (state.waterLevel > 80) waterState = 2;

      // 3. Atmosphere State (0: thin, 1: normal, 2: thick)
      let atmosphereState = 1;
      if (state.atmosphereLevel < 20) atmosphereState = 0;
      else if (state.atmosphereLevel > 80) atmosphereState = 2;

      // 4. Habitability Score (0.0 to 1.0) - Eksplisit sesuai skill.md
      const heatScoreMap = [0.2, 1.0, 0.6, 0.0]
      const waterScoreMap = [0.2, 1.0, 0.5]
      const atmosphereScoreMap = [0.3, 1.0, 0.6]

      const heatScore = heatScoreMap[heatLevel]
      const waterScore = waterScoreMap[waterState]
      const atmosphereScore = atmosphereScoreMap[atmosphereState]

      const habitabilityScore = (heatScore * 0.4) + (waterScore * 0.3) + (atmosphereScore * 0.3)

      return {
        // RAW INPUT
        temperature: temp,
        distance: state.distance,
        waterLevel: state.waterLevel,
        atmosphereLevel: state.atmosphereLevel,

        // DERIVED STATE
        heatLevel,
        waterState,
        atmosphereState,
        habitabilityScore
      }
    }
  }
})