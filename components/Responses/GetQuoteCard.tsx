import { Connection, PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import type { ToolResultPart } from 'ai'
import { memo, useMemo } from 'react'
import { getMint } from '@solana/spl-token'
import { yunaAPIClient } from 'utils'
import Decimal from 'decimal.js'
import { Button, H4, H6, Spinner, XStack, YStack } from 'tamagui'
import { Text } from 'tamagui'
import { useChat } from 'hooks/useChat'

function GetQuoteCard(props: ToolResultPart) {
  const { setIsLoading, handleSubmit } = useChat()

  const result = useMemo(() => {
    return props.result as {
      computedAutoSlippage: number
      contextSlot: number
      inAmount: string
      inputMint: string
      otherAmountThreshold: string
      outAmount: string
      outputMint: string
      priceImpactPct: string
      routePlan: {
        swapInfo: {
          ammKey: string
          label: string
          inputMint: string
          outputMint: string
          inAmount: string
          outAmount: string
          feeAmount: string
          feeMint: string
        }
        percent: number
      }[]
    }
  }, [props.result])

  const quote = useQuery({
    queryKey: [props.toolName, props.toolCallId],
    queryFn: async () => {
      const [inputToken, outputToken] = await Promise.all([
        yunaAPIClient.get('/assets/tokenassets', {
          params: {
            blockchain: 'solana',
            contractAddress: result.inputMint,
            asset: 'info',
          },
        }),
        yunaAPIClient.get('/assets/tokenassets', {
          params: {
            blockchain: 'solana',
            contractAddress: result.outputMint,
            asset: 'info',
          },
        }),
      ])

      const inputTokenData = inputToken.data
      const outputTokenData = outputToken.data

      const inputTokenUIAmount = new Decimal(result.inAmount).div(
        10 ** inputTokenData.decimals
      )
      const outputTokenUIAmount = new Decimal(result.outAmount).div(
        10 ** outputTokenData.decimals
      )

      return {
        ...result,
        uiInAmount: inputTokenUIAmount.toNumber(),
        uiOutAmount: outputTokenUIAmount.toNumber(),
        inputTokenSymbol: inputTokenData.symbol,
        outputTokenSymbol: outputTokenData.symbol,
      }
    },
  })

  async function submit(v: 'yes' | 'no') {
    await handleSubmit(undefined, v)
  }

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
      {quote.isLoading ? (
        <Spinner size="large" />
      ) : (
        <YStack gap="$2">
          <H4>Swap Quote</H4>
          <Text>
            {Intl.NumberFormat('en', {}).format(quote.data?.uiInAmount ?? 0)}{' '}
            {quote.data?.inputTokenSymbol} →{' '}
            {Intl.NumberFormat('en', {}).format(quote.data?.uiOutAmount ?? 0)}{' '}
            {quote.data?.outputTokenSymbol}
          </Text>
          <Text>
            Price Impact:{' '}
            {Intl.NumberFormat('en').format(
              Number.parseFloat(quote.data?.priceImpactPct ?? '0')
            )}
            %
          </Text>

          <YStack>
            <Text>Route Plan:</Text>
            <XStack separator={<Text> {'>'} </Text>}>
              {quote.data?.routePlan.map((route) => (
                <Text key={route.swapInfo.outAmount}>{route.swapInfo.label}</Text>
              ))}
            </XStack>
          </YStack>

          <YStack>
            <Text>Confirm swap?</Text>
            <XStack gap={'$2'}>
              <Button
                flex={1}
                backgroundColor={'$blue10'}
                color={'white'}
                onPress={async () => await submit('yes')}
              >
                Yes
              </Button>
              <Button
                flex={1}
                borderColor={'$blue6'}
                onPress={async () => await submit('no')}
              >
                No
              </Button>
            </XStack>
          </YStack>
        </YStack>
      )}
    </YStack>
  )
}

export default memo(GetQuoteCard)
