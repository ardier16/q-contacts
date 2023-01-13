import { storage } from './storage'

import { Message, MessageType, StorageItemKey } from '@/constants/extension'

export function initMessagesListeners (): void {
  chrome.runtime.onMessage.addListener(onMessage)
  chrome.runtime.onMessageExternal.addListener(onMessage)
}

function onMessage (
  message: Message,
  _: unknown,
  sendResponse: (payload: unknown) => void,
) {
  const { type, payload } = message
  const payloadRecord = payload as Record<string, string>

  switch (type) {
    case MessageType.storageGet:
      sendResponse(storage.getItem(payload as StorageItemKey))
      break

    case MessageType.storageSet:
      storage.setItem(payloadRecord.key as StorageItemKey, payloadRecord.value)
      break

    case MessageType.storageRemove:
      storage.removeItem(payload as StorageItemKey)
      break
  }

  return true
}
