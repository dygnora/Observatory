// Import all images eagerly for Vite resolution bounds
const modules = import.meta.glob('./celestial/**/*.{svg,png}', { eager: true, import: 'default' })

/**
 * Strict Asset Resolver
 * @param {Object} query
 * @param {string} query.domain - 'planets', 'stars', 'satellites'
 * @param {string} query.name - e.g., 'earth', 'sun'
 * @param {string} query.file - e.g., 'base.svg', 'water-flood.png'
 * @returns {string|null} Resolved asset URL
 */
export const getAsset = ({ domain, name, file }) => {
  const path = `./celestial/${domain}/${name}/${file}`
  
  if (!modules[path]) {
    console.warn(`[AssetLoader] Missing asset: ${path}`)
    return null
  }
  
  return modules[path]
}
