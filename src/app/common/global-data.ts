const globalData: any = {}

export function set (key: string, val: any) {
  globalData[key] = val
}

export function get (key: string) {
  return globalData[key]
}

export function remove (key: string) {
  delete globalData[key]
}