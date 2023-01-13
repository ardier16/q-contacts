import { useState } from 'react'

import { CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { Flex, IconButton, Text, Tooltip } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'

import AddressIcon from './AddressIcon'

import { trimAddress } from '@/utils/strings'

interface Props {
  address: string;
}

export default function Address ({ address }: Props) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    copy(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <Flex gap={1} alignItems="center">
      <AddressIcon address={address} />
      <Text fontSize="12px" fontWeight="medium">
        {trimAddress(address)}
      </Text>
      <Tooltip label="Copy">
        <IconButton
          colorScheme="green"
          size="xs"
          aria-label="Edit contact"
          variant="unstyled"
          padding={0}
          icon={copied ? <CheckIcon /> : <CopyIcon />}
          onClick={copyToClipboard}
        />
      </Tooltip>
    </Flex>
  )
}
