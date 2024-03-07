# Celo stuck TX bugs

This repository contains a TypeScript script that demonstrates two bugs related to transaction handling in the Celo blockchain.

## Description

The script sends a transaction to the Celo network with an incorrect fee adapter and then attempts to replace it with a new one.

1. The first bug is that sending a transaction with an incorrect fee adapter will get it stuck in the pending state indefinitely. This is demonstrated by sending a transaction with an old, incorrect fee adapter. The transaction is sent successfully but remains in the pending state.

2. The second bug is that the replacement transaction fails unless it is a legacy transaction type. If the `gasPrice` field is used to force the transaction to be a legacy type, the replacement transaction is successful.

This was tested against https://alfajores-forno.celo-testnet.org running Celo node v1.8.1.

## Usage

To run the script, follow these steps:

1. Install the necessary dependencies with `yarn install`.
2. Run the script with `yarn demo`.

## Example output

```
❯ yarn demo
yarn run v1.22.21
$ ts-node demo.ts
Determining balances for account: 0x11489aE0761343c3B03C630a63B00fa025BC4eEa
1.981423632 CELO
95.997099 STBLTEST

=> Sending CIP64 transaction with incorrect fee adapter...
Successfully sent 0xf7855f50a144b5b3931a905fc371877c5727952b73d3205c72abbec22b7578f6
It will be stuck in pending state, until the bug is fixed
Checking status for 0xf7855f50a144b5b3931a905fc371877c5727952b73d3205c72abbec22b7578f6 (attempt 1/3)...
Transaction is still pending...
Checking status for 0xf7855f50a144b5b3931a905fc371877c5727952b73d3205c72abbec22b7578f6 (attempt 2/3)...
Transaction is still pending...
Checking status for 0xf7855f50a144b5b3931a905fc371877c5727952b73d3205c72abbec22b7578f6 (attempt 3/3)...
Transaction is still pending...

=> Trying to replace the transaction with a new valid CIP64 one...
It will fail with 'replacement transaction underpriced', until the bug 2nd is fixed
Error sending transaction: TransactionExecutionError: Missing or invalid parameters.
Double check you have provided the correct parameters.

URL: https://alfajores-forno.celo-testnet.org
Request body: {"method":"eth_sendRawTransaction","params":["0x02f86d82aef3168477359400852e90edd000826aa49411489ae0761343c3b03c630a63b00fa025bc4eea0180c001a063dc1c0f22f7f4c4377c153fb351bd05f91eb41050f359a140d4569152119f68a0773334c7c82e15d11b9a8e4f9f3df7d4ef46f217f26730ed7ee2683b0dfe133b"]}

Request Arguments:
  from:          0x11489aE0761343c3B03C630a63B00fa025BC4eEa
  to:            0x11489aE0761343c3B03C630a63B00fa025BC4eEa
  value:         0.000000000000000001 ETH
  maxFeePerGas:  200 gwei
  nonce:         22

Details: replacement transaction underpriced
Version: viem@2.7.20
    at getTransactionError (/Users/jean/src/github.com/jeanregisser/celo-stuck-tx-bug/node_modules/viem/utils/errors/getTransactionError.ts:44:10)
    at sendTransaction (/Users/jean/src/github.com/jeanregisser/celo-stuck-tx-bug/node_modules/viem/actions/wallet/sendTransaction.ts:228:30)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /Users/jean/src/github.com/jeanregisser/celo-stuck-tx-bug/demo.ts:109:18 {
  details: 'replacement transaction underpriced',
  docsPath: undefined,
  metaMessages: [
    'URL: https://alfajores-forno.celo-testnet.org',
    'Request body: {"method":"eth_sendRawTransaction","params":["0x02f86d82aef3168477359400852e90edd000826aa49411489ae0761343c3b03c630a63b00fa025bc4eea0180c001a063dc1c0f22f7f4c4377c153fb351bd05f91eb41050f359a140d4569152119f68a0773334c7c82e15d11b9a8e4f9f3df7d4ef46f217f26730ed7ee2683b0dfe133b"]}',
    ' ',
    'Request Arguments:',
    '  from:          0x11489aE0761343c3B03C630a63B00fa025BC4eEa\n' +
      '  to:            0x11489aE0761343c3B03C630a63B00fa025BC4eEa\n' +
      '  value:         0.000000000000000001 ETH\n' +
      '  maxFeePerGas:  200 gwei\n' +
      '  nonce:         22'
  ],
  shortMessage: 'Missing or invalid parameters.\n' +
    'Double check you have provided the correct parameters.',
  version: 'viem@2.7.20',
  cause: InvalidInputRpcError: Missing or invalid parameters.
  Double check you have provided the correct parameters.

  URL: https://alfajores-forno.celo-testnet.org
  Request body: {"method":"eth_sendRawTransaction","params":["0x02f86d82aef3168477359400852e90edd000826aa49411489ae0761343c3b03c630a63b00fa025bc4eea0180c001a063dc1c0f22f7f4c4377c153fb351bd05f91eb41050f359a140d4569152119f68a0773334c7c82e15d11b9a8e4f9f3df7d4ef46f217f26730ed7ee2683b0dfe133b"]}

  Details: replacement transaction underpriced
  Version: viem@2.7.20
      at delay.count.count (/Users/jean/src/github.com/jeanregisser/celo-stuck-tx-bug/node_modules/viem/utils/buildRequest.ts:127:21)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at async attemptRetry (/Users/jean/src/github.com/jeanregisser/celo-stuck-tx-bug/node_modules/viem/utils/promise/withRetry.ts:39:22) {
    details: 'replacement transaction underpriced',
    docsPath: undefined,
    metaMessages: [
      'URL: https://alfajores-forno.celo-testnet.org',
      'Request body: {"method":"eth_sendRawTransaction","params":["0x02f86d82aef3168477359400852e90edd000826aa49411489ae0761343c3b03c630a63b00fa025bc4eea0180c001a063dc1c0f22f7f4c4377c153fb351bd05f91eb41050f359a140d4569152119f68a0773334c7c82e15d11b9a8e4f9f3df7d4ef46f217f26730ed7ee2683b0dfe133b"]}'
    ],
    shortMessage: 'Missing or invalid parameters.\n' +
      'Double check you have provided the correct parameters.',
    version: 'viem@2.7.20',
    cause: RpcRequestError: RPC Request failed.

    URL: https://alfajores-forno.celo-testnet.org
    Request body: {"method":"eth_sendRawTransaction","params":["0x02f86d82aef3168477359400852e90edd000826aa49411489ae0761343c3b03c630a63b00fa025bc4eea0180c001a063dc1c0f22f7f4c4377c153fb351bd05f91eb41050f359a140d4569152119f68a0773334c7c82e15d11b9a8e4f9f3df7d4ef46f217f26730ed7ee2683b0dfe133b"]}

    Details: replacement transaction underpriced
    Version: viem@2.7.20
        at request (/Users/jean/src/github.com/jeanregisser/celo-stuck-tx-bug/node_modules/viem/clients/transports/http.ts:120:19)
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at async delay.count.count (/Users/jean/src/github.com/jeanregisser/celo-stuck-tx-bug/node_modules/viem/utils/buildRequest.ts:104:18)
        at async attemptRetry (/Users/jean/src/github.com/jeanregisser/celo-stuck-tx-bug/node_modules/viem/utils/promise/withRetry.ts:39:22) {
      details: 'replacement transaction underpriced',
      docsPath: undefined,
      metaMessages: [Array],
      shortMessage: 'RPC Request failed.',
      version: 'viem@2.7.20',
      cause: [Object],
      code: -32000
    },
    code: -32000
  }
}

=> Trying to replace the transaction using a legacy TX type...
It will work, because the legacy type is not affected by the bug
Waiting for transaction receipt for 0xb6a33a0cd0300ba81496ce4e34dbfba5a5749671c1ad670b92c0e3a393b831fa
Receipt: {
  blockHash: '0xdc354d9d12dd68438f789e0de2bec864f46c85522df0af14681f446f78664fd0',
  blockNumber: 22882489n,
  contractAddress: null,
  cumulativeGasUsed: 21000n,
  effectiveGasPrice: 20000000000n,
  from: '0x11489ae0761343c3b03c630a63b00fa025bc4eea',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 'success',
  to: '0x11489ae0761343c3b03c630a63b00fa025bc4eea',
  transactionHash: '0xb6a33a0cd0300ba81496ce4e34dbfba5a5749671c1ad670b92c0e3a393b831fa',
  transactionIndex: 0,
  type: 'legacy'
}
✨  Done in 24.01s.
```