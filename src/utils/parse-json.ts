export function parseJson (raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch (error) {
    console.error(error)
    return {}
  }
}
