import { Button, Text } from 'tamagui'
import { Anchor } from 'tamagui'
import { YStack } from 'tamagui'
import type { Transaction } from 'utils/types'

export default function TransactionCard(props: Transaction) {
  return (
    <YStack gap="$4">
      <Text>{props.summary}</Text>
      <Button backgroundColor={'$colorTransparent'} borderColor={'$blue6'}>
        <Anchor href={props.blockExplorerUrl}>View on Solscan</Anchor>
      </Button>
    </YStack>
  )
}
