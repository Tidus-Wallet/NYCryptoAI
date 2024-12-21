import { Eye, EyeOff } from '@tamagui/lucide-icons'
import { useToastController } from '@tamagui/toast'
import { useState } from 'react'
import { Clipboard } from 'react-native'
import { useMMKVStorage } from 'react-native-mmkv-storage'
import { Text } from 'tamagui'
import { Anchor, Button, Input, Paragraph, Spacer, XStack, YStack } from 'tamagui'
import storage from 'utils/storage'

export default function SettingsView() {
  const [solanaPrivateKey, setSolanaPrivateKey] = useMMKVStorage<string>(
    'solanaPrivateKey',
    storage
  )
  const [_, setMessages] = useMMKVStorage('messages', storage)
  const [input, setInput] = useState('')
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false)
  const toast = useToastController()

  return (
    <YStack flex={1} alignItems="center" justifyContent="center">
      <XStack justifyContent="center" alignItems="center" gap="$3">
        <Text
          maxWidth={'60%'}
          onPress={() => {
            if (solanaPrivateKey) {
              Clipboard.setString(solanaPrivateKey)
              return toast.show('Private key copied to clipboard', {
                burntOptions: { haptic: 'success' },
              })
            }

            toast.show('No private key found', {
              burntOptions: { haptic: 'error', preset: 'error' },
            })
          }}
        >
          {isPrivateKeyVisible
            ? (solanaPrivateKey ?? 'No private key found')
            : (solanaPrivateKey?.split('').map(() => '*') ?? 'No private key found')}
        </Text>
        {isPrivateKeyVisible ? (
          <EyeOff onPress={() => setIsPrivateKeyVisible(false)} />
        ) : (
          <Eye onPress={() => setIsPrivateKeyVisible(true)} />
        )}
      </XStack>
      <Spacer size="$4" />
      <Input
        placeholder="Enter your Solana private key"
        value={input}
        onChangeText={(v) => setInput(v)}
        width="60%"
        maxWidth={300}
      />
      <Spacer size="$4" />
      <Button
        width="60%"
        maxWidth={300}
        onPress={() => {
          if (input.length < 32) {
            return toast.show('Please enter a valid private key', {
              burntOptions: { haptic: 'error', preset: 'error' },
            })
          }

          toast.show('Private key saved', { burntOptions: { haptic: 'success' } })
          setSolanaPrivateKey(input)
        }}
      >
        Save
      </Button>
      <Spacer size="$4" />
      <Button
        width="60%"
        maxWidth={300}
        theme="red"
        onPress={() => {
          setSolanaPrivateKey(undefined)
          setMessages(undefined)
          toast.show('Storage successfully cleared', {
            burntOptions: { haptic: 'success' },
          })
        }}
      >
        Clear storage
      </Button>

      <YStack position="absolute" alignItems="center" bottom={40}>
        <XStack gap="$2">
          <Paragraph ta="center">Made by</Paragraph>
          <Anchor col="$blue10" href="https://x.com/devshogun" target="_blank">
            @devshogun
          </Anchor>
        </XStack>
        <XStack gap="$2">
          <Paragraph ta="center">Powered by</Paragraph>
          <Anchor col="$blue10" href="https://x.com/tiduswallet" target="_blank">
            @tiduswallet, Yuna API,
          </Anchor>
          <Paragraph ta="center">and</Paragraph>
          <Anchor col="$blue10" href="https://discord.gg/Uc2eqvdcbn" target="_blank">
            GOAT
          </Anchor>
        </XStack>
      </YStack>
    </YStack>
  )
}
