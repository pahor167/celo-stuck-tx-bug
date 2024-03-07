# Celo stuck TX bugs

This repository contains a TypeScript script that demonstrates two bugs related to transaction handling in the Celo blockchain.

## Description

The script sends a transaction to the Celo network with an incorrect fee adapter and then attempts to replace it with a new one.

1. The first bug is that sending a transaction with an incorrect fee adapter will get it stuck in the pending state indefinitely. This is demonstrated by sending a transaction with an old, incorrect fee adapter. The transaction is sent successfully but remains in the pending state.

2. The second bug is that the replacement transaction fails unless it is a legacy transaction type. If the `gasPrice` field is used to force the transaction to be a legacy type, the replacement transaction is successful.

## Usage

To run the script, follow these steps:

1. Install the necessary dependencies with `yarn install`.
2. Run the script with `yarn demo`.

## Example output



