import type { ToolResultPart } from 'ai'
import { useMemo } from 'react'
import { FlatList } from 'react-native'
import { Text } from 'tamagui'

export default function GetTransactionHistory(toolResult: ToolResultPart) {
  const result = useMemo(() => {
    return toolResult.result as ({
      value: number
      blockExplorerUrl: string
      blockchain: string
      summary: string
      blocktime: number
      timestamp: string
      unit: string
      fromAddress: string
      toAddress: string
      txHash: string
    } & ({ icons?: string[] } | { icon?: string }))[]
  }, [toolResult.result])

  return (
    <FlatList
      data={result}
      keyExtractor={(v) => v.txHash}
      scrollEnabled={false}
      style={{ flexGrow: 0 }}
      renderItem={({ item: v }) => {
        return <Text>{v.summary}</Text>
      }}
    />
  )
}
