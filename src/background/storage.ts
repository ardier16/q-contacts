import { StorageItemKey } from '@/constants/extension'
import { Contact } from '@/types/contacts'
import { parseJson } from '@/utils/parse-json'

const STORAGE_KEY = 'q-contacts'

class Storage {
  contacts!: Contact[]
  version!: string

  constructor () {
    this._setDefaults()
  }

  init (): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.get(STORAGE_KEY, async data => {
        if (!data[STORAGE_KEY]) {
          await this._save()
          resolve()
          return
        }

        const parsed = parseJson(data[STORAGE_KEY]) as Record<string, unknown>

        this.version = String(parsed.version || '')
        this.contacts = parsed.contacts as Contact[] || []

        resolve()
      })
    })
  }

  getItem (key: StorageItemKey) {
    return this[key]
  }

  async setItem (key: StorageItemKey, value: unknown) {
    if (!(key in this)) return

    this[key] = value as never
    await this._save()
  }

  async removeItem (key: StorageItemKey) {
    await this.setItem(key, '')
  }

  async clear () {
    this._setDefaults()
    await this._save()
  }

  private _setDefaults () {
    this.contacts = []
    this.version = ''
  }

  private _save (): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.set({
        [STORAGE_KEY]: JSON.stringify({
          contacts: this.contacts,
          version: this.version,
        }),
      }, resolve)
    })
  }
}

export const storage = new Storage()
