import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, useDisclosure, useToast } from '@chakra-ui/react'

import { useContacts } from '../providers/ContactsProvider'

import ContactModal from './ContactModal'

import { Contact } from '@/types/contacts'
import { isAddress } from '@/utils/strings'

export default function ListActions () {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { contacts, addContacts } = useContacts()

  const exportContacts = () => {
    const data = JSON.stringify(contacts, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.download = 'contacts.json'
    link.href = url
    link.click()
  }

  const importContacts = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result
        if (!data) return

        try {
          const newContacts = JSON.parse(data as string) as Contact[]
          const filteredContracts = newContacts.filter((contact) => {
            return !contacts.find((c) => c.address === contact.address) &&
              isAddress(contact.address) &&
              contact.name.length > 0 &&
              contact.name.length <= 40
          })
          addContacts(...filteredContracts)
          toast({
            title: 'Import successful!',
            description: `Imported ${filteredContracts.length} contacts`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } catch (e) {
          console.error(e)
          toast({
            title: 'Import failed :(',
            description: 'The file you selected is not a valid contacts file',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }

      reader.readAsText(file)
      input.remove()
    }

    input.click()
  }

  return (
    <Flex gap={2}>
      <Button
        colorScheme="green"
        size="sm"
        variant="ghost"
        onClick={exportContacts}
      >
        Export
      </Button>

      <Button
        colorScheme="green"
        size="sm"
        variant="ghost"
        onClick={importContacts}
      >
        Import
      </Button>

      <Button
        colorScheme="green"
        size="sm"
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        New
      </Button>

      <ContactModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  )
}
