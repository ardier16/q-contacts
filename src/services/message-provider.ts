import { Message, MessageType, StorageItemKey } from '@/constants/extension'

export class MessageProvider {
  public extensionId: string

  constructor () {
    this.extensionId = ''
  }

  setExtensionId (extensionId: string): void {
    this.extensionId = extensionId
  }

  getStorageItem (key: StorageItemKey): Promise<unknown> {
    return this.sendMessage({ type: MessageType.storageGet, payload: key })
  }

  setStorageItem (key: StorageItemKey, value: unknown): Promise<unknown> {
    return this.sendMessage({
      type: MessageType.storageSet,
      payload: { key, value },
    })
  }

  removeStorageItem (payload: StorageItemKey): Promise<unknown> {
    return this.sendMessage({ type: MessageType.storageRemove, payload })
  }

  sendMessage (message: Message): Promise<unknown> {
    return new Promise(resolve => {
      return this.extensionId
        ? chrome.runtime.sendMessage(this.extensionId, message, resolve)
        : chrome.runtime.sendMessage(message, resolve)
    })
  }
}
