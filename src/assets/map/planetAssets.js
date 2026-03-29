// Base Planets
import earthBase from '../celestial/planets/earth/base.svg'
import jupiterBase from '../celestial/planets/jupiter/base.svg'
import marsBase from '../celestial/planets/mars/base.svg'
import mercuryBase from '../celestial/planets/mercury/base.svg'
import neptuneBase from '../celestial/planets/neptune/base.svg'
import saturnBase from '../celestial/planets/saturn/base.svg'
import uranusBase from '../celestial/planets/uranus/base.svg'
import venusBase from '../celestial/planets/venus/base.svg'

// Celestial Bodies
import sunBase from '../celestial/stars/sun/base.svg'
import moonBase from '../celestial/satellites/moon/base.svg'

// Earth Layers
import earthIceLight from '../celestial/planets/earth/ice-light.png'
import earthIceHeavy from '../celestial/planets/earth/ice-heavy.png'
import earthCracksLight from '../celestial/planets/earth/cracks-light.png'
import earthCracksHeavy from '../celestial/planets/earth/cracks-heavy.png'
import earthAtmosphere from '../celestial/planets/earth/atmosphere.png'
import earthClouds from '../celestial/planets/earth/clouds.svg'
import earthWaterFlood from '../celestial/planets/earth/water-flood.png'

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
