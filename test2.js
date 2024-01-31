const { Connection, PublicKey } = require('@solana/web3.js');

// Replace these values with your own
const transactionSignature = 'YOUR_TRANSACTION_SIGNATURE';
const rpcUrl = 'https://api.devnet.solana.com';

async function fetchTransactionDetails() {
  try {
    // Connect to the Solana devnet (replace with the appropriate network)
    const connection = new Connection(rpcUrl, 'confirmed');

    // Fetch transaction details using the transaction signature
    const signature = transactionSignature;
    const transaction = await connection.getTransaction(signature, 'confirmed');

    // Print transaction details
    console.log('Transaction details:');
    console.log('Signature:', transactionSignature);
    console.log('Block hash:', transaction.slot);
    console.log('Transaction fee:', transaction.meta.fee);
    console.log('Unix timestamp:', transaction.blockTime);

    // You can access more details as needed from the `transaction` object
    console.log('Transaction object:', transaction);

  } catch (error) {
    console.error('Error fetching transaction details:', error);
  }
}

// Run the function to fetch transaction details
fetchTransactionDetails();
