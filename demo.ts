import {
  createPublicClient,
  createWalletClient,
  formatEther,
  formatUnits,
  http,
  parseGwei,
} from "viem";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import { celoAlfajores } from "viem/chains";
import "dotenv/config";
import { erc20Abi } from "./erc20";

const CELO_DERIVATION_PATH = "m/44'/52752'/0'/0/0";

const USDC_ADDRESS = "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B";
const USDC_DECIMALS = 6;
const USDC_FEE_ADAPTER_ADDRESS =
  "0xdb93874fe111f5a87acc11ff09ee9450ac6509ae";
const USDC_FEE_ADAPTER_DECIMALS = 18;

// Number of attempts to check if the transaction is confirmed
const MAX_ATTEMPTS = 3;
const WAIT_TIME_MS = 5_000;

const MNEMONIC = process.env.MNEMONIC;

// if (!MNEMONIC) {
//   throw new Error("Please set MNEMONIC in .env file");
// }

// account from private key
const account = privateKeyToAccount(
  "0x" // add private key in format 0x...
);
// const account = mnemonicToAccount(MNEMONIC, {
//   path: CELO_DERIVATION_PATH as any,
// });
const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});
const walletClient = createWalletClient({
  chain: celoAlfajores, // Celo testnet
  transport: http(),
});

(async () => {
  console.log(`Determining balances for account: ${account.address}`);
  const celoBalance = await publicClient.getBalance({
    address: account.address,
  });
  const celoBalanceInDecimal = formatEther(celoBalance);
  console.log(`${celoBalanceInDecimal} CELO`);

  // Get USDC token balance
  const stblBalance = await publicClient.readContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account.address],
  });
  const stblBalanceInDecimal = formatUnits(stblBalance, USDC_DECIMALS);
  console.log(`${stblBalanceInDecimal} USDC`);

  if (celoBalance <= 0) {
    throw new Error("Please add CELO to your account");
  }
  if (stblBalance <= 0) {
    throw new Error("Please add USDC to your account");
  }

  console.log(`\n=> Sending CIP64 transaction with fee adapter...`);

  const txHasWithAdapter = await walletClient.sendTransaction({
    account,
    to: account.address, // sending to self
    value: 1n,
    feeCurrency: "0x4822e58de6f5e485eF90df51C41CE01721331dC0",
    maxFeePerGas: parseGwei("30"),
  });

  console.log(
    `Successfully sent ${txHasWithAdapter}\nIt will be stuck in pending state, until the bug is fixed`
  );

  await new Promise((resolve) => setTimeout(resolve, 5000));
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    console.log(
      `Checking status for ${txHasWithAdapter} (attempt ${
        i + 1
      }/${MAX_ATTEMPTS})...`
    );
    const txIncorrectAdapter = await publicClient.getTransaction({
      hash: txHasWithAdapter,
    });
    if (txIncorrectAdapter.blockNumber) {
      console.log("Transaction is confirmed! Stuck TX bug is fixed! 🎉🎉🎉");
      console.log("Transaction details:", txIncorrectAdapter);
      process.exit(0);
      break;
    } else {
      console.log("Transaction is still pending...");
    }
    if (i < MAX_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME_MS));
    }
  }

  // Get nonce to replace the stuck transaction
  const nonce = await publicClient.getTransactionCount({
    address: account.address,
  });

  console.log(
    "\n=> Trying to replace the transaction with a new valid CIP64 one...\nIt will fail with 'replacement transaction underpriced', until the 2nd bug is fixed"
  );
  const txHash = await walletClient
    .sendTransaction({
      account,
      to: account.address, // sending to self
      value: 1n,
      maxFeePerGas: parseGwei("200"), // no matter what maxFeePerGas is used, it will return "replacement transaction underpriced"
      nonce,
    })
    .catch((e) => {
      console.error("Error sending transaction:", e);
      return undefined;
    });

  if (txHash) {
    console.log(`Waiting for transaction receipt for ${txHash}`);
    const txReceipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    console.log("Receipt:", txReceipt);
    console.log(
      "Transaction is confirmed! CIP64 underpriced replacement bug is fixed! 🎉🎉🎉"
    );
    console.log("Transaction receipt:", txReceipt);
    process.exit(0);
  }

  console.log(
    "\n=> Trying to replace the transaction using a legacy TX type...\nIt will work, because the legacy type is not affected by the bug"
  );

  // This one will work
  const txHashUnstuck = await walletClient.sendTransaction({
    account,
    to: account.address, // sending to self
    value: 1n,
    gasPrice: parseGwei("20"), // This forces the transaction to be a legacy type
    nonce,
  });

  console.log(`Waiting for transaction receipt for ${txHashUnstuck}`);
  const txReceiptUnstuck = await publicClient.waitForTransactionReceipt({
    hash: txHashUnstuck,
  });
  console.log("Receipt:", txReceiptUnstuck);
})();
