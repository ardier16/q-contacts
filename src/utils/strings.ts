
export function trimAddress (address: string): string {
  return `${address.slice(0, 5)}...${address.slice(-4)}`
}

export function capitalize<T extends string> (str: T = '' as T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>
}

export function titleCase (value = ''): string {
  return value
    .toLowerCase()
    .split(' ')
    .map(capitalize)
    .join(' ')
}

export function isAddress (value: string) {
  return /^(0x)?[0-9a-f]{40}$/i.test(value.toLowerCase())
}
