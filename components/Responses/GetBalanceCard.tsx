import { Keypair } from '@solana/web3.js'
import type { ToolResultPart } from 'ai'
import { useMemo } from 'react'
import { FlatList } from 'react-native'
import { Anchor, AvatarFallback, Button, Separator } from 'tamagui'
import { Avatar, AvatarImage, H6, XStack } from 'tamagui'
import { H3, H5 } from 'tamagui'
import { Text, YStack } from 'tamagui'
import storage from 'utils/storage'
import base58 from 'bs58'

export default function GetBalanceCard(toolResult: ToolResultPart) {
  const result = useMemo(() => {
    return (
      toolResult.result as {
        decimals: number
        symbol: string
        value: number
        mintAddress: string
        icon: string
        usd: number
      }[]
    ).filter((v) => v.usd > 0)
  }, [toolResult.result])

  const totalBalance = useMemo(() => {
    return result.reduce((acc, curr) => acc + curr.usd, 0)
  }, [result])

  // const keypair = Keypair.fromSecretKey(base58.decode(solanaPrivateKey))
  const keyPair = useMemo(() => {
    const solanaPrivateKey = storage.getString('solanaPrivateKey')

    if (!solanaPrivateKey) return null

    const keypair = Keypair.fromSecretKey(base58.decode(solanaPrivateKey))
    return keypair
  }, [])

  return (
    <YStack
      gap="$2"
      my="$2"
      backgroundColor={'$accentBackground'}
      p="$4"
      br="$6"
      borderTopLeftRadius={'$1'}
      borderTopRightRadius={'$6'}
      maxWidth={'80%'}
      alignSelf={'flex-start'}
    >
      <H6>Total Balance: </H6>
      <H3>${totalBalance.toFixed(2)}</H3>

      <FlatList
        data={result}
        scrollEnabled={false}
        ItemSeparatorComponent={<Separator borderColor={'$blue6'} />}
        style={{ flexGrow: 0 }}
        keyExtractor={(v) => v.mintAddress}
        renderItem={({ item: v }) => (
          <XStack key={v.mintAddress} gap="$2" my="$2">
            <Avatar circular size={'$3'}>
              <AvatarImage source={{ uri: v.icon }} />
              <AvatarFallback backgroundColor={'$blue10'} />
            </Avatar>

            <YStack>
              <Text fontWeight={'bold'}>
                {Intl.NumberFormat('en', {}).format(v.value)} {v.symbol}
              </Text>
              <Text>${v.usd.toFixed(2)}</Text>
            </YStack>
          </XStack>
        )}
      />

      <Button borderColor={'$blue6'} backgroundColor={'$colorTransparent'}>
        <Anchor
          href={`https://solscan.io/account/${keyPair?.publicKey?.toBase58()}`}
          target="_blank"
        >
          View on Solscan
        </Anchor>
      </Button>
    </YStack>
  )
}
