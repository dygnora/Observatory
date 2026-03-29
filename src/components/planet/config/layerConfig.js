import { HEAT, WATER, ATMOSPHERE } from '../../../constants/planetState'

// Configuration dictates exact CSS injections for generic layers!
export const LAYER_STYLES = {
  ice: {
    zIndex: 20,
    blendMode: 'screen',
    backdropFilter: 'sepia(1) hue-rotate(180deg) saturate(2) brightness(1.2)',
    radialGradient: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(135,206,235,0.2) 100%)'
  },
  heatLight: {
    zIndex: 21,
    blendMode: 'multiply',
    backdropFilter: 'sepia(0.5) hue-rotate(-20deg) saturate(2) brightness(0.9)',
    imageFixedOpacity: true // let intensity drive container, not purely image
  },
  heatExtreme: {
    zIndex: 21,
    blendMode: 'multiply',
    backdropFilter: 'sepia(1) hue-rotate(-50deg) saturate(3) brightness(0.8)',
    radialGradient: 'radial-gradient(circle, rgba(255,69,0,0.3) 0%, rgba(139,0,0,0.5) 100%)'
  },
  waterFlood: {
    zIndex: 22,
    blendMode: 'multiply',
    backdropFilter: 'sepia(0.8) hue-rotate(195deg) saturate(3) brightness(1.1) contrast(1.1)',
    radialGradient: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.4) 0%, rgba(0, 119, 190, 0.6) 50%, rgba(0, 20, 60, 0.9) 100%)',
    boxShadow: 'inset -25px -25px 50px rgba(0, 0, 40, 0.8), inset 10px 10px 30px rgba(150, 230, 255, 0.5)'
  },
  waterDry: {
    zIndex: 22,
    blendMode: 'multiply',
    backdropFilter: 'sepia(1) hue-rotate(10deg) saturate(3) brightness(0.8)',
    radialGradient: 'radial-gradient(circle, rgba(160, 82, 45, 0.4) 0%, rgba(139, 69, 19, 0.7) 100%)'
  },
  atmosphere: {
    zIndex: 23,
    blendMode: 'screen',
    opacityBase: 0.5,
    ignoreMask: true,
    transform: 'scale(1.1)',
    fallbackGradient: 'radial-gradient(circle, rgba(255,255,255,0) 60%, rgba(200,230,255,0.6) 100%)'
  }
}

// Generate an array of rendering instructions passed strictly down to generic loop
export const getActiveLayers = (planetState, progressives) => {
  // Array Statis: Semua elemen dikonstruksi secara DOM dan hanya visibilitas (intensity/opacity) yang reaktif
  // Memecahkan masalah "Jumping" pada slider karena render Vue component insertion!
  return [
    {
      id: 'ice-light',
      intensity: progressives.ice,
      styleConfig: LAYER_STYLES.ice,
      imageFile: 'ice-light.png' 
    },
    {
      id: 'ice-heavy',
      intensity: progressives.ice > 0.5 ? (progressives.ice - 0.5) * 2 : 0,
      styleConfig: LAYER_STYLES.ice,
      imageFile: 'ice-heavy.png'
    },
    {
      id: 'heat-light',
      intensity: progressives.heat,
      styleConfig: LAYER_STYLES.heatLight,
      imageFile: 'cracks-light.png' 
    },
    {
      id: 'heat-extreme',
      intensity: progressives.heat > 0.5 ? (progressives.heat - 0.5) * 2 : 0,
      styleConfig: LAYER_STYLES.heatExtreme,
      imageFile: 'cracks-heavy.png'
    },
    {
      id: 'water-flood',
      intensity: progressives.flood,
      styleConfig: LAYER_STYLES.waterFlood,
      imageFile: 'water-flood.png'
    },
    {
      id: 'water-dry',
      intensity: progressives.dry,
      styleConfig: LAYER_STYLES.waterDry,
      imageFile: null // Secara eksplisit MENGUNCI error console, karena lapisan ini murni filter bumi gundul!
    },
    {
      id: 'atmosphere',
      intensity: planetState.atmosphereLevel / 100,
      styleConfig: LAYER_STYLES.atmosphere,
      imageFile: 'atmosphere.png'
    }
  ]
}

// Existing legacy (used by Mascot Layers)
export const mascotConfig = {
  showBlush: (state) => state.heatLevel === HEAT.COLD,
  showSweat: (state) => state.heatLevel === HEAT.HOT,
  showFire: (state) => state.heatLevel === HEAT.EXTREME
}
