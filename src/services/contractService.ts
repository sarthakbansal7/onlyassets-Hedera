import { ethers } from 'ethers';
import adminABI from '../utils/adminABI.json';

const CONTRACT_ADDRESS = "0x66EeAE947cb03e034664e45BFDA7c4bbAae4394f";
const RPC_URL = "https://testnet.hashio.io/api";

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, adminABI, provider);

export const getAllIssuers = async () => {
  try {
    // Get current block number
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 50000); // Last ~7 days on Hedera
    
    // Create filter for IssuerAdded events
    const filter = contract.filters.IssuerAdded();
    const events = await contract.queryFilter(filter, fromBlock, "latest");
    
    console.log(`Found ${events.length} IssuerAdded events from block ${fromBlock} to ${currentBlock}`);
    
    // Get current issuers from contract directly
    let currentIssuers: string[] = [];
    try {
      currentIssuers = await contract.getAllIssuers();
    } catch (error) {
      console.log('getAllIssuers function not available, using events only');
    }
    
    // Extract issuer data from events
    const eventIssuers = events.map(event => ({
      address: event.args.issuer,
      metadata: event.args.metadataURI,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    }));
    
    // If we have current issuers from contract, filter events to only include current ones
    const activeIssuers = currentIssuers.length > 0 
      ? eventIssuers.filter(issuer => currentIssuers.includes(issuer.address))
      : eventIssuers;
    
    // Log each active issuer found
    activeIssuers.forEach((issuer, index) => {
      console.log(`Active Issuer ${index + 1}: ${issuer.address} (metadata: ${issuer.metadata})`);
    });
    
    const addresses = activeIssuers.map(issuer => issuer.address);
    const metadata = {};
    activeIssuers.forEach(issuer => {
      metadata[issuer.address] = issuer.metadata;
    });
    
    return {
      addresses,
      count: addresses.length,
      metadata
    };
  } catch (error) {
    console.error('Error fetching issuers from events:', error);
    return { addresses: [], count: 0, metadata: {} };
  }
};

export const getAllManagers = async () => {
  try {
    // Get current block number
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 50000); // Last ~7 days on Hedera
    
    // Create filter for ManagerAdded events
    const filter = contract.filters.ManagerAdded();
    const events = await contract.queryFilter(filter, fromBlock, "latest");
    
    console.log(`Found ${events.length} ManagerAdded events from block ${fromBlock} to ${currentBlock}`);
    
    // Get current managers from contract directly
    let currentManagers: string[] = [];
    try {
      currentManagers = await contract.getAllManagers();
    } catch (error) {
      console.log('getAllManagers function not available, using events only');
    }
    
    // Extract manager data from events
    const eventManagers = events.map(event => ({
      address: event.args.manager,
      metadata: event.args.metadataURI,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    }));
    
    // If we have current managers from contract, filter events to only include current ones
    const activeManagers = currentManagers.length > 0 
      ? eventManagers.filter(manager => currentManagers.includes(manager.address))
      : eventManagers;
    
    // Log each active manager found
    activeManagers.forEach((manager, index) => {
      console.log(`Active Manager ${index + 1}: ${manager.address} (metadata: ${manager.metadata})`);
    });
    
    const addresses = activeManagers.map(manager => manager.address);
    const metadata = {};
    activeManagers.forEach(manager => {
      metadata[manager.address] = manager.metadata;
    });
    
    return {
      addresses,
      count: addresses.length,
      metadata
    };
  } catch (error) {
    console.error('Error fetching managers from events:', error);
    return { addresses: [], count: 0, metadata: {} };
  }
};

export const isIssuer = async (address: string) => {
  try {
    return await contract.isIssuer(address);
  } catch (error) {
    console.error('Error checking issuer status:', error);
    return false;
  }
};

export const addIssuer = async (address: string, metadataURI: string, signer: ethers.Signer) => {
  try {
    const contractWithSigner = contract.connect(signer);
    const tx = await contractWithSigner.addIssuer(address, metadataURI, {
      gasLimit: 3000000
    });
    await tx.wait();
    console.log('Issuer added successfully:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error adding issuer:', error);
    throw error;
  }
};

export const addManager = async (address: string, metadataURI: string, signer: ethers.Signer) => {
  try {
    const contractWithSigner = contract.connect(signer);
    const tx = await contractWithSigner.addManager(address, metadataURI, {
      gasLimit: 3000000
    });
    await tx.wait();
    console.log('Manager added successfully:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error adding manager:', error);
    throw error;
  }
};

export const removeIssuer = async (address: string, signer: ethers.Signer) => {
  try {
    const contractWithSigner = contract.connect(signer);
    const tx = await contractWithSigner.removeIssuer(address, {
      gasLimit: 3000000
    });
    await tx.wait();
    console.log('Issuer removed successfully:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error removing issuer:', error);
    throw error;
  }
};

export const removeManager = async (address: string, signer: ethers.Signer) => {
  try {
    const contractWithSigner = contract.connect(signer);
    const tx = await contractWithSigner.removeManager(address, {
      gasLimit: 3000000
    });
    await tx.wait();
    console.log('Manager removed successfully:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error removing manager:', error);
    throw error;
  }
};

export const pauseMarketplace = async (signer: ethers.Signer) => {
  try {
    const contractWithSigner = contract.connect(signer);
    const tx = await contractWithSigner.pauseMarketplace({
      gasLimit: 3000000
    });
    await tx.wait();
    console.log('Marketplace pause status toggled successfully:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error toggling marketplace pause status:', error);
    throw error;
  }
};

export const getMarketplacePaused = async () => {
  try {
    const isPaused = await contract.marketplacePaused();
    console.log('Marketplace paused status:', isPaused);
    return isPaused;
  } catch (error) {
    console.error('Error getting marketplace paused status:', error);
    return false;
  }
};
