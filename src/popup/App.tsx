
import { useEffect, useState } from 'react'

import { ChakraProvider, Divider, Flex, Grid, Heading, Image } from '@chakra-ui/react'

import ContactsList from './components/ContactsList'
import ListActions from './components/ListActions'
import { useContacts } from './providers/ContactsProvider'

export default function App () {
  const [isLoaded, setIsLoaded] = useState(false)
  const { loadContacts } = useContacts()

  useEffect(() => {
    loadContacts().then(() => setIsLoaded(true))
  })

  return (
    <ChakraProvider>
      <Grid
        width={480}
        paddingY={4}
        alignContent="start"
        gap={2}
      >
        <Grid gap={2}>
          <Flex paddingX={4} justifyContent="space-between">
            <Flex gap={2}>
              <Image
                src="/img/logo-48.png"
                alt="Q Logo"
                width={8}
                height={8}
              />

              <Heading as="h1" size="lg">
                Contacts
              </Heading>
            </Flex>

            <ListActions />
          </Flex>

          <Divider />
        </Grid>

        {isLoaded && <ContactsList />}
      </Grid>
    </ChakraProvider>
  )
}
