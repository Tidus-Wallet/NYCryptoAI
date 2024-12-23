import { useQuery } from '@tanstack/react-query'
import TransactionCard from './TransactionCard'
import { yunaAPIClient } from 'utils'
import { Spinner, YStack } from 'tamagui'

export default function GetTransactionInfoCard(props: { hash: string }) {
  const { data: txInfo, isPending } = useQuery({
    queryKey: ['getSolanaTransactionInfo', props.hash],
    queryFn: async () => {
      const res = await yunaAPIClient.get(`/transaction/${props.hash}`, {
        params: {
          blockchain: 'solana',
        },
      })

      return res.data
    },
  })

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
      {isPending && <Spinner size="large" />}
      {txInfo && <TransactionCard {...txInfo} />}
    </YStack>
  )
}
