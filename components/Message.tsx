import { useToastController } from '@tamagui/toast'
import { Clipboard } from 'react-native'
import { Paragraph, Text, YStack, H3 } from 'tamagui'

const SOLANA_ADDRESS_REGEX = /[1-9A-HJ-NP-Za-km-z]{32,88}/g
// const HEADER_REGEX = /^###\s+(.+)$/gm

const Message = ({ role, content }: { role: string; content: string }) => {
  const toast = useToastController()

  const handleCopy = async (address: string) => {
    Clipboard.setString(address)
    toast.show('Address copied to clipboard', {
      burntOptions: { haptic: 'success' },
    })
  }

  const renderContent = () => {
    // Split content into lines to process headers
    const lines = content.split('\n')

    return (
      <YStack gap="$2">
        {lines.map((line, lineIndex) => {
          // Check if line is a header
          const headerMatch = line.match(/^###\s+(.+)$/)
          if (headerMatch) {
            return (
              <H3 key={`line-${lineIndex}`} fontWeight="bold">
                {headerMatch[1]}
              </H3>
            )
          }

          // Process non-header lines for bold text and addresses
          const boldSegments = [] as { text: string; bold: boolean }[]
          let currentText = line

          while (currentText.length > 0) {
            const nextBoldStart = currentText.indexOf('**')
            if (nextBoldStart === -1) {
              if (currentText.length > 0) {
                boldSegments.push({ text: currentText, bold: false })
              }
              break
            }

            if (nextBoldStart > 0) {
              boldSegments.push({
                text: currentText.slice(0, nextBoldStart),
                bold: false,
              })
            }

            const boldEnd = currentText.indexOf('**', nextBoldStart + 2)
            if (boldEnd === -1) {
              boldSegments.push({
                text: currentText.slice(nextBoldStart),
                bold: false,
              })
              break
            }

            boldSegments.push({
              text: currentText.slice(nextBoldStart + 2, boldEnd),
              bold: true,
            })

            currentText = currentText.slice(boldEnd + 2)
          }

          return (
            <Paragraph key={`line-${lineIndex}`}>
              {boldSegments.map((segment, segmentIndex) => {
                const parts = segment.text.split(SOLANA_ADDRESS_REGEX)
                const addresses = segment.text.match(SOLANA_ADDRESS_REGEX) || []

                return (
                  <Text key={`segment-${segmentIndex}`}>
                    {parts.map((part, partIndex) => (
                      <Text
                        key={`part-${partIndex}`}
                        fontWeight={segment.bold ? 'bold' : 'normal'}
                      >
                        {part}
                        {addresses[partIndex] && (
                          <Text
                            color="$blue10"
                            fontWeight={segment.bold ? 'bold' : 'normal'}
                            onPress={() => handleCopy(addresses[partIndex])}
                          >
                            {addresses[partIndex]}
                          </Text>
                        )}
                      </Text>
                    ))}
                  </Text>
                )
              })}
            </Paragraph>
          )
        })}
      </YStack>
    )
  }

  return (
    <YStack gap="$2" my="$2">
      <Text fontWeight="bold" color={role === 'user' ? '$blue10' : '$color'}>
        {role === 'user' ? 'You' : 'Wallet'}
      </Text>
      {renderContent()}
    </YStack>
  )
}

export default Message
