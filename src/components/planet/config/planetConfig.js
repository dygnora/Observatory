export const PLANET_CONFIG = {
  earth: {
    domain: 'planets',
    name: 'earth',
    label: 'Bumi',
    distance: 300,
    size: 35,
    period: 365,
    // Available simulation mechanics isolated to planet capacities
    capabilities: ['water', 'cracks', 'ice', 'atmosphere']
  },
  mars: {
    domain: 'planets',
    name: 'mars',
    label: 'Mars',
    distance: 380,
    size: 25,
    period: 687,
    capabilities: ['cracks', 'ice', 'atmosphere'] 
  },
  neptune: {
    domain: 'planets',
    name: 'neptune',
    label: 'Neptunus',
    distance: 920,
    size: 40,
    period: 60190,
    capabilities: ['ice', 'atmosphere']
  }
  // Others easily added without writing component files
}
