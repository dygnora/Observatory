import { defineStore } from 'pinia'
import { HEAT, WATER, ATMOSPHERE } from '../constants/planetState'

export const useSimulationStore = defineStore('simulation', {
  state: () => ({
    currentView: 'solar', 
    distance: 50,      
    waterLevel: 50,    
    atmosphereLevel: 50,
    isLowDevice: false // Handled structurally by explicit action hook
  }),
  
  actions: {
    initDeviceProfile() {
      // Degrades CSS rendering on browsers running 4 threads or fewer to maintain FPS target
      this.isLowDevice = navigator.hardwareConcurrency <= 4
      console.log(`[Simulation] Device CPU Cores: ${navigator.hardwareConcurrency} | Low Device Mode: ${this.isLowDevice}`)
    }
  },

  getters: {
    temperature(state) {
      const baseTemp = 15; 
      const distanceEffect = (50 - state.distance) * 1.5; 
      const atmosphereEffect = (state.atmosphereLevel - 50) * 0.5;
      return Math.round(baseTemp + distanceEffect + atmosphereEffect);
    },

    planetState(state) {
      const temp = this.temperature;

      let heatLevel = HEAT.NORMAL;
      if (temp < -15) heatLevel = HEAT.COLD;
      else if (temp > 60) heatLevel = HEAT.EXTREME;
      else if (temp > 40) heatLevel = HEAT.HOT;

      let waterState = WATER.BALANCED;
      if (state.waterLevel < 20) waterState = WATER.DRY;
      else if (state.waterLevel > 80) waterState = WATER.FLOOD;

      let atmosphereState = ATMOSPHERE.NORMAL;
      if (state.atmosphereLevel < 20) atmosphereState = ATMOSPHERE.THIN;
      else if (state.atmosphereLevel > 80) atmosphereState = ATMOSPHERE.THICK;

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