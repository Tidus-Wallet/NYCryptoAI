import Message from 'components/Message'
import type { CustomMessage } from 'hooks/useChat'
import GetBalanceCard from './GetBalanceCard'
import { memo } from 'react'
import GetQuoteCard from './GetQuoteCard'

function Response(message: CustomMessage) {
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
              return <GetQuoteCard {...v} />
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
