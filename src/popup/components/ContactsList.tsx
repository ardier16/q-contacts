import { useMemo, useState } from 'react'

import { CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Flex, Grid, IconButton, Input, InputGroup, InputRightElement, Text, useDisclosure, useToast } from '@chakra-ui/react'

import { useContacts } from '../providers/ContactsProvider'

import Address from './Address'
import ContactModal from './ContactModal'

import { Contact } from '@/types/contacts'

export default function ContactsList () {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { contacts, deleteContact } = useContacts()

  const [search, setSearch] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact>()

  const filteredContacts = useMemo(() => {
    return contacts.filter(({ address, name }) => {
      const searchLower = search.toLowerCase()
      return (
        address.toLowerCase().includes(searchLower) ||
        name.toLowerCase().includes(searchLower)
      )
    })
  }, [search, contacts])

  const handleDeleteContact = async (contact: Contact) => {
    await deleteContact(contact)
    toast({
      title: 'Contact deleted',
      description: `Deleted "${contact.name}" from your contacts`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Grid
      gap={2}
      paddingTop={2}
      paddingX={4}
      height={320}
      overflow="auto"
      alignContent="start"
    >
      <InputGroup size="sm">
        <Input
          value={search}
          placeholder="Search"
          colorScheme="green"
          onChange={(e) => setSearch(e.target.value)}
        />

        {search !== '' && (
          <InputRightElement>
            <IconButton
              size="xs"
              variant="unstyled"
              aria-label="Clear search"
              icon={<CloseIcon boxSize={3} color="gray.700" />}
              onClick={() => setSearch('')}
            />
          </InputRightElement>
        )}
      </InputGroup>

      {filteredContacts.map((contact) => (
        <Grid
          key={contact.address}
          templateColumns="minmax(0, 1fr) 140px auto"
          alignContent="start"
          gap={6}
          paddingY={1}
          borderBottom="1px solid #E2E8F0"
        >
          <Text fontWeight="bold" fontSize="14px">
            {contact.name}
          </Text>

          <Address address={contact.address} />

          <Flex justifyContent="space-between" gap={2}>
            <IconButton
              colorScheme="blue"
              size="xs"
              aria-label="Edit contact"
              icon={<EditIcon />}
              onClick={() => {
                setSelectedContact(contact)
                onOpen()
              }}
            />

            <IconButton
              colorScheme="red"
              size="xs"
              aria-label="Delete contact"
              icon={<DeleteIcon />}
              onClick={() => handleDeleteContact(contact)}
            />
          </Flex>
        </Grid>
      ))}

      {filteredContacts.length === 0 && (
        <Text
          fontSize="16px"
          color="gray.500"
          textAlign="center"
          paddingY={16}
        >
          No contacts found
        </Text>
      )}

      <ContactModal
        isOpen={isOpen}
        contact={selectedContact}
        onClose={onClose}
      />
    </Grid>
  )
}
