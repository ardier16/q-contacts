export const IS_DEV_ENV = process.env.NODE_ENV === 'development'

export enum MessageType {
  storageGet = 'storage:get',
  storageSet = 'storage:set',
  storageRemove = 'storage:remove',
  extensionId = 'extension-id',
}

export type Message = {
  type: MessageType,
  payload?: Record<string, unknown> | string | number
}

export enum StorageItemKey {
  version = 'version',
  contacts = 'contacts',
}

export const EXTENSION_PERMISSIONS = Object.freeze({
  permissions: [
    'storage'
  ],
})
