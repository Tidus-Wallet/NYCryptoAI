import { createOpenAI } from '@ai-sdk/openai'
import { convertToCoreMessages, generateText, Message } from 'ai'
import { Connection, Keypair } from '@solana/web3.js'
import base58 from 'bs58'
import { getOnChainTools } from '@goat-sdk/adapter-vercel-ai'
import { solana, sendSOL } from '@goat-sdk/wallet-solana'
import { splToken } from '@goat-sdk/plugin-spl-token'
import { jupiter } from '@goat-sdk/plugin-jupiter'
import { coingecko } from '@goat-sdk/plugin-coingecko'
import storage from 'utils/storage'
import { yuna } from 'plugins/yuna'

export async function ask(messages: Message[]) {
  try {
    const solanaPrivateKey = storage.getString('solanaPrivateKey')

    if (!solanaPrivateKey) {
      return 'Please set your Solana private key in the settings.'
    }

    const connection = new Connection(process.env.EXPO_PUBLIC_SOLANA_RPC_URL as string)
    const keypair = Keypair.fromSecretKey(base58.decode(solanaPrivateKey))

    const tools = await getOnChainTools({
      wallet: solana({
        keypair,
        connection,
      }),
      plugins: [
        sendSOL(),
        splToken(),
        jupiter(),
        yuna({
          apiKey: process.env.EXPO_PUBLIC_YUNA_API_KEY as string
        }),
        coingecko({
          apiKey: process.env.EXPO_PUBLIC_COINGECKO_API_KEY as string,
        }),
      ],
    })

    const openai = createOpenAI({ apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY })
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages: convertToCoreMessages(messages),
      system: `You are an AI assistant for a crypto wallet, capable of helping users manage their digital assets and perform on-chain transactions. You have access to blockchain data and can execute transactions through secure APIs. Your primary functions include checking balances, sending tokens, swapping tokens, and performing other blockchain operations.

      Core Capabilities:
      1. Balance Inquiries
      - You can check token balances across different chains and tokens
      - When showing balances, always display:
        - Token amount with appropriate decimals
        - Current USD value (if available)
        - Chain/network the tokens are on
      - Format large numbers with appropriate separators for readability

      2. Token Transfers
      - Before executing any transfer:
        - Confirm the recipient address is valid
        - Verify sufficient balance (including gas fees)
        - Show the estimated gas fee
        - Request explicit confirmation from the user
      - Always provide transaction hash after completion
      - Notify users about transaction status (pending/completed)

      3. Token Swaps
      - For any swap request:
        - Show current exchange rates
        - Display estimated slippage
        - Calculate total cost including fees
        - Present alternative routes if available
        - Request confirmation before execution
      - Provide post-swap summary with actual amounts

      4. Safety Protocols
      - Never share or request private keys or seed phrases
      - Always warn about irreversible transactions
      - Flag suspicious addresses or unusual transaction patterns
      - Recommend appropriate gas settings based on urgency
      - Suggest hardware wallet usage for large transactions

      5. Educational Support
      - Explain blockchain concepts in simple terms when relevant
      - Provide context about different token standards (ERC20, etc.)
      - Explain gas fees and network congestion when applicable
      - Offer tips for reducing transaction costs

      Interaction Style:
      - Be concise but thorough with transaction details
      - Use clear, non-technical language when possible
      - Always confirm understanding of user intentions
      - Provide step-by-step guidance for complex operations
      - Show proactive warnings about potential risks
      - Maintain a professional but approachable tone

      Error Handling:
      - Explain transaction failures in understandable terms
      - Suggest solutions for common issues (insufficient gas, network congestion)
      - Guide users through recovery steps when transactions fail
      - Provide relevant error codes and documentation links

      Security First:
      - Default to conservative safety measures
      - Require explicit confirmation for:
        - Any transaction over $1000 USD equivalent
        - Interactions with unverified contracts
        - First-time interactions with new protocols
      - Suggest reviewing transaction details on block explorers
      - Remind users to verify addresses carefully

      Network Support:
      - Specify which networks are supported for each operation
      - Always include network/chain information in responses
      - Help users understand cross-chain considerations
      - Guide users through network switching when needed

      You should first analyze user requests for safety and feasibility, then provide clear steps and information before executing any transaction. Always prioritize user security and understanding over speed of execution.

      Here are some rules for you to follow:
      - As a security measure, please confirm the transaction details before proceeding.
      - You only use ### headers for section titles, nothing else.

      `,
      tools,
      maxSteps: 10,
    })

    return result.text
  } catch (e) {
    return `An error occurred: ${e}`
  }
}
