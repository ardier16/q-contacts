import { Grid, Input as ChakraInput, Text } from '@chakra-ui/react'

interface Props {
  value: string;
  error: string;
  placeholder: string;
  label: string;
  onChange: (value: string) => void;
}

export default function Input ({ value, error, placeholder, label, onChange }: Props) {
  return (
    <Grid gap={1}>
      <Text fontSize="12px">{label}</Text>

      <ChakraInput
        value={value}
        isInvalid={error !== ''}
        placeholder={placeholder}
        colorScheme="green"
        onChange={(e) => onChange(e.target.value)}
      />

      {error !== '' && (
        <Text fontSize="12px" color="red.500">{error}</Text>
      )}
    </Grid>
  )
}
