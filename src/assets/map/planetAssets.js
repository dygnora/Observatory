// Base Planets
import earthBase from '../planets/earth/base.svg'
import jupiterBase from '../planets/jupiter/base.svg'
import marsBase from '../planets/mars/base.svg'
import mercuryBase from '../planets/mercury/base.svg'
import neptuneBase from '../planets/neptune/base.svg'
import saturnBase from '../planets/saturn/base.svg'
import uranusBase from '../planets/uranus/base.svg'
import venusBase from '../planets/venus/base.svg'

// Celestial Bodies
import sunBase from '../celestial/sun/base.svg'
import moonBase from '../celestial/moon/base.svg'

// Earth Layers
import earthIceLight from '../planets/earth/ice-light.png'
import earthIceHeavy from '../planets/earth/ice-heavy.png'
import earthCracksLight from '../planets/earth/cracks-light.png'
import earthCracksHeavy from '../planets/earth/cracks-heavy.png'
import earthAtmosphere from '../planets/earth/atmosphere.png'
import earthClouds from '../planets/earth/clouds.svg'
import earthWaterFlood from '../planets/earth/water-flood.png'

export const planetAssets = {
  earth: {
    base: earthBase,
    iceLight: earthIceLight,
    iceHeavy: earthIceHeavy,
    cracksLight: earthCracksLight,
    cracksHeavy: earthCracksHeavy,
    atmosphere: earthAtmosphere,
    clouds: earthClouds,
    waterFlood: earthWaterFlood
  },
  jupiter: { base: jupiterBase },
  mars: { base: marsBase },
  mercury: { base: mercuryBase },
  neptune: { base: neptuneBase },
  saturn: { base: saturnBase },
  uranus: { base: uranusBase },
  venus: { base: venusBase }
}

export const celestialAssets = {
  sun: { base: sunBase },
  moon: { base: moonBase }
}
