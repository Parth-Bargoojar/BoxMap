'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

/**
 * True only after hydration. Use to defer rendering values that don't exist on
 * the server (e.g. the resolved colour theme) without a setState-in-effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
}
