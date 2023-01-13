import { Button, Grid, useToast } from '@chakra-ui/react'

import useForm from '../hooks/useForm'
import { useContacts } from '../providers/ContactsProvider'

import Input from './Input'

import { Contact } from '@/types/contacts'
import { address, maxLength, required } from '@/utils/validators'

interface Props {
  contact?: Contact
  onSubmit: () => void;
}

export default function ContactForm ({ contact, onSubmit }: Props) {
  const toast = useToast()
  const { contacts, addContacts, updateContact } = useContacts()

  const form = useForm({
    initialValues: {
      name: contact?.name || '',
      address: contact?.address || ''
    },
    validators: {
      name: [required, maxLength(40)],
      address: [required, address]
    },
    onSubmit: async (form) => {
      if (checkDuplicateAddress(form.address)) {
        toast({
          title: 'Duplicate address',
          description: 'This address is already in your contacts',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      contact
        ? await updateContact(form, contact)
        : await addContacts(form)

      toast({
        title: contact ? 'Contact updated' : 'Contact added',
        description: contact
          ? 'You\'ve successfully updated contact'
          : 'You\'ve successfully added a new contact',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onSubmit()
    }
  })

  function checkDuplicateAddress (address: string) {
    return contact
      ? contacts.some((c) => c.address === address && c.address !== contact.address)
      : contacts.some((c) => c.address === address)
  }

  return (
    <form noValidate onSubmit={form.submit}>
      <Grid gap={4}>
        <Input
          {...form.fields.name}
          label="Contact name"
          placeholder="1-40 characters"
        />

        <Input
          {...form.fields.address}
          label="Wallet address"
          placeholder="0x..."
        />

        <Button
          colorScheme="green"
          type="submit"
        >
          Save
        </Button>
      </Grid>
    </form>
  )
}
