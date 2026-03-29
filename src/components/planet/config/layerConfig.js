import { HEAT, WATER, ATMOSPHERE } from '../../../constants/planetState'

export const layerConfig = {
  ice: (state) => state.heatLevel === HEAT.COLD,
  cracks: (state) => state.heatLevel >= HEAT.HOT,
  water: (state) => state.waterState !== WATER.BALANCED,
  atmosphere: (state) => state.atmosphereLevel > 0
}

export const mascotConfig = {
  showBlush: (state) => state.heatLevel === HEAT.COLD,
  showSweat: (state) => state.heatLevel === HEAT.HOT,
  showFire: (state) => state.heatLevel === HEAT.EXTREME
}
