import { initMessagesListeners } from './messages'
import { storage } from './storage'

init()

async function init () {
  await storage.init()
  initMessagesListeners()
}
