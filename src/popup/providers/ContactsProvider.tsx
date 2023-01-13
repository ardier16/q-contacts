import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

import { StorageItemKey } from '@/constants/extension'
import { MessageProvider } from '@/services/message-provider'
import { Contact } from '@/types/contacts'

interface Context {
  contacts: Contact[]
  loadContacts: () => Promise<void>
  addContacts: (...contacts: Contact[]) => void
  updateContact: (newContact: Contact, oldContact: Contact) => void
  deleteContact: (contact: Contact) => void
}

const messageProvider = new MessageProvider()
const ContactsContext = createContext({} as Context)

export default function ContactsProvider ({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([])

  const loadContacts = async () => {
    const contacts = await messageProvider.getStorageItem(StorageItemKey.contacts) as Contact[]
    setContacts(contacts || [])
  }

  const addContacts = useCallback((...newContacts: Contact[]) => {
    saveContacts([...contacts, ...newContacts])
  }, [contacts])

  const updateContact = useCallback((newContact: Contact, oldContact: Contact) => {
    saveContacts(contacts.map(c => c.address === oldContact.address ? newContact : c))
  }, [contacts])

  const deleteContact = useCallback((contact: Contact) => {
    saveContacts(contacts.filter(c => c.address !== contact.address))
  }, [contacts])

  const saveContacts = (contacts: Contact[]) => {
    setContacts(contacts)
    messageProvider.setStorageItem(StorageItemKey.contacts, contacts)
  }

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        loadContacts,
        addContacts,
        updateContact,
        deleteContact
      }}
    >
      {children}
    </ContactsContext.Provider>
  )
}

export const useContacts = () => useContext(ContactsContext)
