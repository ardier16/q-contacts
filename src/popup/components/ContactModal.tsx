
import { useRef } from 'react'

import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'

import ContactForm from './ContactForm'

import { Contact } from '@/types/contacts'

interface Props {
  isOpen: boolean
  contact?: Contact
  onClose: () => void
}

export default function ContactModal ({ isOpen, contact, onClose }: Props) {
  const finalRef = useRef(null)

  return (
    <Modal
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent paddingBottom={2}>
        <ModalHeader>
          {contact ? 'Edit Contact' : 'New Contact'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ContactForm contact={contact} onSubmit={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
