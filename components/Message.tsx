import { useToastController } from '@tamagui/toast'
import { type ReactNode, useCallback, useMemo } from 'react'
import { Clipboard } from 'react-native'
import { Paragraph, Text, YStack, H4, Anchor } from 'tamagui'

const SOLANA_ADDRESS_REGEX = /[1-9A-HJ-NP-Za-km-z]{32,88}/g
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g

interface TextSegment {
  content: string
  isLink?: boolean
  url?: string
  isBold?: boolean
}

const Message = ({ role, content }: { role: string; content: string }) => {
  const toast = useToastController()

  const handleCopy = useCallback(
    async (address: string) => {
      Clipboard.setString(address)
      toast.show('Address copied to clipboard', {
        burntOptions: { haptic: 'success' },
      })
    },
    [toast]
  )

  const processLine = useCallback((line: string): TextSegment[] => {
    const segments: TextSegment[] = []
    const currentText = line
    let lastIndex = 0

    // First, process all links
    const linkMatches = Array.from(currentText.matchAll(MARKDOWN_LINK_REGEX))
    for (let i = 0; i < linkMatches.length; i++) {
      const match = linkMatches[i]
      const [fullMatch, linkText, url] = match
      const matchIndex = match.index!

      if (matchIndex > lastIndex) {
        segments.push({ content: currentText.slice(lastIndex, matchIndex) })
      }

      segments.push({ content: linkText, isLink: true, url })
      lastIndex = matchIndex + fullMatch.length
    }

    if (lastIndex < currentText.length) {
      segments.push({ content: currentText.slice(lastIndex) })
    }

    // Then, process bold text
    const processedSegments: TextSegment[] = []
    for (const segment of segments) {
      if (segment.isLink) {
        processedSegments.push(segment)
        continue
      }

      let text = segment.content
      const boldSegments: TextSegment[] = []

      while (text.length > 0) {
        const boldStart = text.indexOf('**')
        if (boldStart === -1) {
          if (text.length > 0) {
            boldSegments.push({ content: text })
          }
          break
        }

        if (boldStart > 0) {
          boldSegments.push({ content: text.slice(0, boldStart) })
        }

        const boldEnd = text.indexOf('**', boldStart + 2)
        if (boldEnd === -1) {
          boldSegments.push({ content: text.slice(boldStart) })
          break
        }

        boldSegments.push({
          content: text.slice(boldStart + 2, boldEnd),
          isBold: true,
        })

        text = text.slice(boldEnd + 2)
      }

      processedSegments.push(...boldSegments)
    }

    return processedSegments
  }, [])

  const renderSegment = useCallback(
    (
      segment: TextSegment,
      segmentIndex: number,
      handleCopy: (address: string) => void
    ): ReactNode => {
      if (segment.isLink) {
        return (
          <Anchor
            key={`segment-${segmentIndex}`}
            href={segment.url}
            target="_blank"
            fontWeight={segment.isBold ? 'bold' : 'normal'}
            color={'$blue10'}
            textDecorationLine="underline"
          >
            {segment.content}
          </Anchor>
        )
      }

      const parts = segment.content.split(SOLANA_ADDRESS_REGEX)
      const addresses = segment.content.match(SOLANA_ADDRESS_REGEX) || []
      const textElements: ReactNode[] = []

      for (let partIndex = 0; partIndex < parts.length; partIndex++) {
        const part = parts[partIndex]
        if (part) {
          textElements.push(
            <Text
              key={`text-${partIndex}`}
              fontWeight={segment.isBold ? 'bold' : 'normal'}
            >
              {part}
            </Text>
          )
        }

        if (addresses[partIndex]) {
          textElements.push(
            <Text
              key={`address-${partIndex}`}
              color="$blue10"
              fontWeight={segment.isBold ? 'bold' : 'normal'}
              onPress={() => handleCopy(addresses[partIndex])}
            >
              {addresses[partIndex]}
            </Text>
          )
        }
      }

      return <Text key={`segment-${segmentIndex}`}>{textElements}</Text>
    },
    []
  )

  const renderedContent = useMemo(() => {
    const lines = content.split('\n')
    const elements: ReactNode[] = []

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex]
      const headerMatch = line.match(/^###\s+(.+)$/)

      if (headerMatch) {
        elements.push(
          <H4 key={`line-${lineIndex}`} fontWeight="bold">
            {headerMatch[1]}
          </H4>
        )
        continue
      }

      const segments = processLine(line)
      const paragraphElements = segments.map((segment, index) =>
        renderSegment(segment, index, handleCopy)
      )

      elements.push(<Paragraph key={`line-${lineIndex}`}>{paragraphElements}</Paragraph>)
    }

    return <YStack gap="$2">{elements}</YStack>
  }, [content, processLine, renderSegment, handleCopy])

  return (
    <YStack
      gap="$2"
      my="$2"
      backgroundColor={role === 'user' ? '$background' : '$accentBackground'}
      p="$4"
      br="$6"
      borderTopLeftRadius={role === 'user' ? '$6' : '$1'}
      borderTopRightRadius={role === 'user' ? '$1' : '$6'}
      maxWidth={'80%'}
      alignSelf={role === 'user' ? 'flex-end' : 'flex-start'}
    >
      {/* <Text fontWeight="bold" color={role === 'user' ? '$blue10' : '$color'}>
        {role === 'user' ? 'You' : 'Wallet'}
      </Text> */}
      {renderedContent}
    </YStack>
  )
}

export default Message
