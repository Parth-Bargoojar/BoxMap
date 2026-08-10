/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker"
import { Serwist } from "serwist"

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: any;
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
  navigationPreload: true,
  runtimeCaching: defaultCache,
})

serwist.addEventListeners()
