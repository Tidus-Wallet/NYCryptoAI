import Message from 'components/Message'
import type { CustomMessage } from 'hooks/useChat'
import { Text } from 'tamagui'
import GetBalanceCard from './GetBalanceCard'
import GetTransactionHistory from './GetTransactionHistory'

export default function Response(message: CustomMessage) {
  return (
    <>
      {message.toolResults ? (
        message.toolResults.map((v) => {
          switch (v.toolName) {
            case 'get_balance':
              return <GetBalanceCard {...v} />
            // case 'getTransactionHistory':
            //   return <GetTransactionHistory {...v} />
            case 'get_quote':
              return <Text key={message.id}>{v.toolName}</Text>
            default:
              return (
                <Message
                  key={message.id}
                  role={message.role}
                  content={message.content.toString()}
                />
              )
          }
        })
      ) : (
        <Message
          key={message.id}
          role={message.role}
          content={message.content.toString()}
        />
      )}
    </>
  )
}
