import { useChat } from 'hooks/useChat'
import { ScrollView, Platform, KeyboardAvoidingView } from 'react-native'
import { useRef, useEffect } from 'react'
import Message from 'components/Message'
import { YStack, XStack, Text, Input, Button } from 'tamagui'

export default function App() {
  const { messages, error, handleInputChange, input, handleSubmit } = useChat()
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  if (error) return <Text color="$red10">{error.message}</Text>

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      // flex={1}
    >
      <YStack px="$3" height={'100%'}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }}
        >
          {messages.map((m) => (
            <Message key={m.id} role={m.role} content={m.content.toString()} />
          ))}
        </ScrollView>

        <XStack
          position="fixed"
          bottom={0}
          borderRadius="$4"
          pb={Platform.OS === 'ios' ? '$5' : '$3'}
        >
          <Input
            multiline
            flex={1}
            bg="$background"
            placeholder="Ask your wallet anything..."
            value={input}
            onChange={(e) =>
              handleInputChange({
                ...e,
                target: {
                  ...e.target,
                  value: e.nativeEvent.text,
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            returnKeyType="send"
            onSubmitEditing={(e) => {
              handleSubmit(e)
              e.preventDefault()
            }}
          />
          <Button onPress={() => handleSubmit()} ml="$2">
            Send
          </Button>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  )
}
