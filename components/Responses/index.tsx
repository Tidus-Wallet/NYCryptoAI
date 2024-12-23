import Message from 'components/Message'
import type { CustomMessage } from 'hooks/useChat'
import GetBalanceCard from './GetBalanceCard'
import { memo } from 'react'
import GetQuoteCard from './GetQuoteCard'
import GetTransactionInfoCard from './GetTransactionInfoCard'

function Response(message: CustomMessage) {
  return (
    <>
      {message.toolResults ? (
        message.toolResults.map((v) => {
          console.log(v.toolName)
          switch (v.toolName) {
            case 'get_balance':
              return <GetBalanceCard {...v} />
            // case 'getTransactionHistory':
            //   return <GetTransactionHistory {...v} />
            case 'get_quote':
              return <GetQuoteCard {...v} />
            case 'swap_tokens':
              return <GetTransactionInfoCard hash={v.result?.hash} />
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

export default memo(Response)
