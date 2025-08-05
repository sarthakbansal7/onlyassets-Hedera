import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LabelInputContainer } from '@/components/ui/form-utils';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Copy, Home, TrendingUp, Building2, Plus, FileText, BarChart3, Shield, Users, Globe } from 'lucide-react';
import { uploadFileToIPFS, uploadJSONToIPFS } from '@/utils/ipfs';

const assetTypes = [
  'Real Estate',
  'Invoice',
  'Commodity',
  'Stocks',
  'CarbonCredit',
];

const priceTokens = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
];

const Issuer: React.FC = () => {
  // Demo mode - no blockchain connections required
  
  // Main navigation state
  const [currentView, setCurrentView] = useState<'dashboard' | 'mint' | 'list'>('dashboard');

  // Dialog states
  const [showNFTDialog, setShowNFTDialog] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);

  // NFT form state
  const [mintStep, setMintStep] = useState(1);
  const [nftTitle, setNftTitle] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftAssetType, setNftAssetType] = useState(0);
  const [nftPriceToken, setNftPriceToken] = useState('USD');
  const [nftEarnXP, setNftEarnXP] = useState('32000');
  const [nftImageFiles, setNftImageFiles] = useState<File[]>([]);
  const [nftId, setNftId] = useState('');
  const [nftAmount, setNftAmount] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  // Real Estate specific fields
  const [realEstateSize, setRealEstateSize] = useState('');
  const [realEstateBedrooms, setRealEstateBedrooms] = useState('');
  const [realEstateLocation, setRealEstateLocation] = useState('');

  // Invoice specific fields
  const [invoiceIssuer, setInvoiceIssuer] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [invoiceRiskRating, setInvoiceRiskRating] = useState('');

  // Commodity specific fields
  const [commodityWeight, setCommodityWeight] = useState('');
  const [commodityPurity, setCommodityPurity] = useState('');
  const [commodityStorage, setCommodityStorage] = useState('');

  // Stocks specific fields
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockExchange, setStockExchange] = useState('');
  const [stockSector, setStockSector] = useState('');

  // Carbon Credits specific fields
  const [carbonStandard, setCarbonStandard] = useState('');
  const [carbonProjectType, setCarbonProjectType] = useState('');
  const [carbonCO2Offset, setCarbonCO2Offset] = useState('');

  // List Asset form state
  const [listTokenId, setListTokenId] = useState('');
  const [listAmount, setListAmount] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [isListingAsset, setIsListingAsset] = useState(false);

  // Success states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [mintedAssetId, setMintedAssetId] = useState<string | null>(null);

  const handleNftImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNftImageFiles(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setNftImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMintNFT = async () => {
    // Demo mode - validate form but don't require wallet connection
    if (!nftTitle || !nftDescription || nftImageFiles.length === 0) {
      toast.error('Please fill all required fields and upload at least one image');
      return;
    }

    setIsMinting(true);
    
    try {
      // 1. Upload images to IPFS (functional)
      const imageUrls = [];
      for (const file of nftImageFiles) {
        const imageUrl = await uploadFileToIPFS(file);
        imageUrls.push(imageUrl);
      }

      // 2. Create metadata object
      const metadata = {
        name: nftTitle,
        description: nftDescription,
        images: imageUrls,
        attributes: [
          {
            trait_type: "Asset Type",
            value: assetTypes[nftAssetType]
          },
          {
            trait_type: "Price Token",
            value: nftPriceToken
          },
          {
            trait_type: "Earn XP",
            value: parseInt(nftEarnXP)
          }
        ],
        external_url: "",
        animation_url: ""
      };

      // Add asset-specific attributes based on type
      if (nftAssetType === 0) { // Real Estate
        if (realEstateSize) metadata.attributes.push({ trait_type: "Size", value: `${realEstateSize} sq ft` });
        if (realEstateBedrooms) metadata.attributes.push({ trait_type: "Bedrooms", value: realEstateBedrooms });
        if (realEstateLocation) metadata.attributes.push({ trait_type: "Location", value: realEstateLocation });
      } else if (nftAssetType === 1) { // Invoice
        if (invoiceIssuer) metadata.attributes.push({ trait_type: "Issuer", value: invoiceIssuer });
        if (invoiceDueDate) metadata.attributes.push({ trait_type: "Due Date", value: invoiceDueDate });
        if (invoiceRiskRating) metadata.attributes.push({ trait_type: "Risk Rating", value: invoiceRiskRating });
      } else if (nftAssetType === 2) { // Commodity
        if (commodityWeight) metadata.attributes.push({ trait_type: "Weight", value: commodityWeight });
        if (commodityPurity) metadata.attributes.push({ trait_type: "Purity", value: commodityPurity });
        if (commodityStorage) metadata.attributes.push({ trait_type: "Storage", value: commodityStorage });
      } else if (nftAssetType === 3) { // Stocks
        if (stockSymbol) metadata.attributes.push({ trait_type: "Symbol", value: stockSymbol });
        if (stockExchange) metadata.attributes.push({ trait_type: "Exchange", value: stockExchange });
        if (stockSector) metadata.attributes.push({ trait_type: "Sector", value: stockSector });
      } else if (nftAssetType === 4) { // Carbon Credits
        if (carbonStandard) metadata.attributes.push({ trait_type: "Standard", value: carbonStandard });
        if (carbonProjectType) metadata.attributes.push({ trait_type: "Project Type", value: carbonProjectType });
        if (carbonCO2Offset) metadata.attributes.push({ trait_type: "CO2 Offset", value: `${carbonCO2Offset} tons` });
      }

      // 3. Upload metadata to IPFS (functional)
      const metadataUri = await uploadJSONToIPFS(metadata);

      // 4. Demo simulation - no actual blockchain transaction
      toast.success('Uploading to IPFS and simulating blockchain transaction...');
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a demo asset ID
      const demoAssetId = `demo-${Date.now()}`;
      setMintedAssetId(demoAssetId);
      setShowSuccessDialog(true);
      setShowNFTDialog(false);
      toast.success('NFT metadata uploaded to IPFS successfully! (Demo mode - no blockchain transaction)');

    } catch (error: any) {
      console.error('Demo minting error:', error);
      toast.error('Failed to upload metadata to IPFS. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  const handleListAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsListingAsset(true);
    
    try {
      // Validate required fields
      if (!listTokenId || !listAmount || !listPrice) {
        toast.error('Please fill all required fields');
        return;
      }

      console.log('Demo listing asset:', { 
        tokenId: listTokenId, 
        amount: listAmount, 
        price: listPrice 
      });

      toast.success('Simulating asset listing...');
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Asset listed successfully in demo mode! Token ID: ${listTokenId}`);
      setShowListDialog(false);
      
      // Reset form
      setListTokenId('');
      setListAmount('');
      setListPrice('');

    } catch (error: any) {
      console.error('Error in demo listing:', error);
      toast.error('Demo listing failed. Please try again.');
    } finally {
      setIsListingAsset(false);
    }
  };

  const resetNFTForm = () => {
    setMintStep(1);
    setNftTitle('');
    setNftDescription('');
    setNftImageFiles([]);
    setNftAssetType(0);
    setNftPriceToken('USD');
    setNftEarnXP('32000');
    setNftId('');
    setNftAmount('');
    
    // Reset asset-specific fields
    setRealEstateSize('');
    setRealEstateBedrooms('');
    setRealEstateLocation('');
    setInvoiceIssuer('');
    setInvoiceDueDate('');
    setInvoiceRiskRating('');
    setCommodityWeight('');
    setCommodityPurity('');
    setCommodityStorage('');
    setStockSymbol('');
    setStockExchange('');
    setStockSector('');
    setCarbonStandard('');
    setCarbonProjectType('');
    setCarbonCO2Offset('');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Professional Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Dashboard Title and Status */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Issuer Dashboard</h1>
                <p className="text-gray-400 mt-1">Manage your tokenized assets and marketplace listings</p>
              </div>
            </div>
            
            {/* Navigation and Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-400 text-sm font-medium">Network: Mainnet</span>
                </div>
                <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">KYC Verified</span>
                </div>
              </div>
              <Button asChild variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Link to="/" className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Link to="/marketplace" className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Marketplace</span>
                </Link>
              </Button>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Assets Created</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Assets Listed</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Volume</p>
                <p className="text-2xl font-bold text-white">$0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg border border-gray-800 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Compliance Status</p>
                <p className="text-lg font-bold text-green-400">Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Asset Creation */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 shadow-xl">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Tokenize New Asset</h3>
                  <p className="text-gray-400 text-sm">Convert physical assets into digital tokens</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Asset Types Supported:</span>
                    <span className="text-white font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IPFS Storage:</span>
                    <span className="text-green-400 font-medium">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token Standard:</span>
                    <span className="text-white font-medium">ERC-1155</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gas Estimation:</span>
                    <span className="text-white font-medium">~0.015 ETH</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowNFTDialog(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start Tokenization
                </Button>
              </div>
            </div>
          </div>

          {/* Market Listing */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 shadow-xl">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">List on Marketplace</h3>
                  <p className="text-gray-400 text-sm">Offer your tokens for public trading</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Listing Fee:</span>
                    <span className="text-white font-medium">2.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Settlement:</span>
                    <span className="text-green-400 font-medium">Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min. Order Size:</span>
                    <span className="text-white font-medium">1 Token</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Hours:</span>
                    <span className="text-green-400 font-medium">24/7</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowListDialog(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Create Listing
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 shadow-xl mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => {/* Handle view portfolio */}}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm font-medium">Portfolio</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => {/* Handle transaction history */}}
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Transactions</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => {/* Handle wallet settings */}}
              >
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Wallet</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => {/* Handle support */}}
              >
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Support</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="mt-8">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 shadow-xl">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Your Asset Portfolio</h3>
                <Button variant="outline" size="sm" className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">No Assets Yet</h4>
                <p className="text-gray-400 mb-4">Start by tokenizing your first real-world asset</p>
                <Button 
                  onClick={() => setShowNFTDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tokenize Asset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* NFT Mint Dialog */}
      <Dialog open={showNFTDialog} onOpenChange={(open) => {
          if (!open) {
            resetNFTForm();
          }
          setShowNFTDialog(open);
        }}>
          <DialogContent className="sm:max-w-lg rounded-xl border border-gray-700 bg-gray-900 shadow-xl p-6 md:p-8 max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white mb-2">Create Asset Token</DialogTitle>
              <DialogDescription className="text-base text-gray-300 mb-4">
                {mintStep === 1
                  ? "Enter the details for your real-world asset tokenization."
                  : "Configure the token parameters for deployment."}
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto scrollbar-hide my-6 pr-2" style={{ maxHeight: 'calc(80vh - 200px)' }}>
              {mintStep === 1 ? (
                <form className="space-y-5">
                  <LabelInputContainer>
                    <Label htmlFor="nftTitle" className="text-gray-200">Asset Title</Label>
                    <Input id="nftTitle" value={nftTitle} onChange={e => setNftTitle(e.target.value)} placeholder="e.g., Manhattan Commercial Property" type="text" className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-400" />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="nftDescription" className="text-gray-200">Description</Label>
                    <Input id="nftDescription" value={nftDescription} onChange={e => setNftDescription(e.target.value)} placeholder="Detailed asset description" type="text" className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-400" />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="nftImage" className="text-gray-200">Asset Documentation</Label>
                    <div className="flex flex-col gap-2">
                      <Input
                        id="nftImage"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleNftImageUpload}
                        className="border-gray-600 bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      />
                      {nftImageFiles.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {nftImageFiles.map((file, index) => (
                            <div key={index} className="relative w-full h-24">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="rounded-lg object-cover w-full h-full border border-gray-600"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 bg-red-500 hover:bg-red-600 text-white border-0"
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="nftAssetType" className="text-gray-200">Asset Category</Label>
                    <select id="nftAssetType" value={nftAssetType} onChange={e => setNftAssetType(Number(e.target.value))} className="border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2">
                      {assetTypes.map((type, idx) => (
                        <option key={type} value={idx}>{type}</option>
                      ))}
                    </select>
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="nftPriceToken" className="text-gray-200">Base Currency</Label>
                    <select id="nftPriceToken" value={nftPriceToken} onChange={e => setNftPriceToken(e.target.value)} className="border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2">
                      {priceTokens.map((token) => (
                        <option key={token} value={token}>{token}</option>
                      ))}
                    </select>
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="nftEarnXP">Token Rewards</Label>
                    <Input id="nftEarnXP" value={nftEarnXP} onChange={e => setNftEarnXP(e.target.value)} placeholder="32000" type="number" className="border-gray-300" />
                  </LabelInputContainer>

                  {/* Conditional fields based on asset type */}
                  {nftAssetType === 0 && ( // Real Estate
                    <>
                      <LabelInputContainer>
                        <Label htmlFor="realEstateSize">Property Size (sq ft)</Label>
                        <Input id="realEstateSize" value={realEstateSize} onChange={e => setRealEstateSize(e.target.value)} placeholder="Enter size in square feet" type="number" className="border-gray-300" />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="realEstateBedrooms">Bedrooms</Label>
                        <Input id="realEstateBedrooms" value={realEstateBedrooms} onChange={e => setRealEstateBedrooms(e.target.value)} placeholder="Number of bedrooms" type="number" className="border-gray-300" />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="realEstateLocation">Location</Label>
                        <Input id="realEstateLocation" value={realEstateLocation} onChange={e => setRealEstateLocation(e.target.value)} placeholder="Property address/location" type="text" className="border-gray-300" />
                      </LabelInputContainer>
                    </>
                  )}

                  {nftAssetType === 1 && ( // Invoice
                    <>
                      <LabelInputContainer>
                        <Label htmlFor="invoiceIssuer">Invoice Issuer</Label>
                        <Input id="invoiceIssuer" value={invoiceIssuer} onChange={e => setInvoiceIssuer(e.target.value)} placeholder="Company name" type="text" className="border-gray-300" />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="invoiceDueDate">Due Date</Label>
                        <Input id="invoiceDueDate" value={invoiceDueDate} onChange={e => setInvoiceDueDate(e.target.value)} placeholder="YYYY-MM-DD" type="date" className="border-gray-300" />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="invoiceRiskRating">Credit Rating</Label>
                        <select id="invoiceRiskRating" value={invoiceRiskRating} onChange={e => setInvoiceRiskRating(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
                          <option value="">Select credit rating</option>
                          <option value="AAA">AAA - Highest Quality</option>
                          <option value="AA">AA - High Quality</option>
                          <option value="A">A - Upper Medium Grade</option>
                          <option value="BBB">BBB - Medium Grade</option>
                          <option value="BB">BB - Lower Medium Grade</option>
                          <option value="B">B - Speculative</option>
                          <option value="CCC">CCC - Highly Speculative</option>
                          <option value="CC">CC - Extremely Speculative</option>
                          <option value="C">C - Default Imminent</option>
                          <option value="D">D - In Default</option>
                        </select>
                      </LabelInputContainer>
                    </>
                  )}

                  {nftAssetType === 2 && ( // Commodity
                    <>
                      <LabelInputContainer>
                        <Label htmlFor="commodityWeight">Weight/Quantity</Label>
                        <Input id="commodityWeight" value={commodityWeight} onChange={e => setCommodityWeight(e.target.value)} placeholder="Weight (kg, tons, etc.)" type="text" className="border-gray-300" />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="commodityPurity">Grade/Purity</Label>
                        <Input id="commodityPurity" value={commodityPurity} onChange={e => setCommodityPurity(e.target.value)} placeholder="Purity percentage or grade" type="text" className="border-gray-300" />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="commodityStorage">Storage Facility</Label>
                        <Input id="commodityStorage" value={commodityStorage} onChange={e => setCommodityStorage(e.target.value)} placeholder="Storage location/facility" type="text" className="border-gray-300" />
                      </LabelInputContainer>
                    </>
                  )}

                  {nftAssetType === 3 && ( // Stocks
                    <>
                      <LabelInputContainer>
                        <Label htmlFor="stockSymbol">Ticker Symbol</Label>
                        <Input id="stockSymbol" value={stockSymbol} onChange={e => setStockSymbol(e.target.value)} placeholder="Stock ticker symbol" type="text" className="border-gray-300" />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="stockExchange">Exchange</Label>
                        <Input id="stockExchange" value={stockExchange} onChange={e => setStockExchange(e.target.value)} placeholder="NYSE, NASDAQ, etc." type="text" className="border-gray-300" />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="stockSector">Industry Sector</Label>
                        <Input id="stockSector" value={stockSector} onChange={e => setStockSector(e.target.value)} placeholder="Technology, Healthcare, etc." type="text" className="border-gray-300" />
                      </LabelInputContainer>
                    </>
                  )}

                  {nftAssetType === 4 && ( // Carbon Credits
                    <>
                      <LabelInputContainer>
                        <Label htmlFor="carbonStandard">Certification Standard</Label>
                        <select id="carbonStandard" value={carbonStandard} onChange={e => setCarbonStandard(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
                          <option value="">Select standard</option>
                          <option value="VCS">VCS (Verified Carbon Standard)</option>
                          <option value="Gold Standard">Gold Standard</option>
                          <option value="CDM">CDM (Clean Development Mechanism)</option>
                          <option value="CAR">CAR (Climate Action Reserve)</option>
                          <option value="ACR">ACR (American Carbon Registry)</option>
                        </select>
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="carbonProjectType">Project Category</Label>
                        <select id="carbonProjectType" value={carbonProjectType} onChange={e => setCarbonProjectType(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
                          <option value="">Select project type</option>
                          <option value="Renewable Energy">Renewable Energy</option>
                          <option value="Forestry">Forestry & Land Use</option>
                          <option value="Energy Efficiency">Energy Efficiency</option>
                          <option value="Methane Capture">Methane Capture</option>
                          <option value="Direct Air Capture">Direct Air Capture</option>
                        </select>
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="carbonCO2Offset">CO2 Offset Capacity (tons)</Label>
                        <Input id="carbonCO2Offset" value={carbonCO2Offset} onChange={e => setCarbonCO2Offset(e.target.value)} placeholder="Amount of CO2 offset in tons" type="number" className="border-gray-300" />
                      </LabelInputContainer>
                    </>
                  )}
                </form>
              ) : (
                <form className="space-y-5">
                  <LabelInputContainer>
                    <Label htmlFor="nftId">Token ID</Label>
                    <Input id="nftId" value={nftId} onChange={e => setNftId(e.target.value)} placeholder="Enter unique token ID" type="number" className="border-gray-300" />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="nftAmount">Token Supply</Label>
                    <Input id="nftAmount" value={nftAmount} onChange={e => setNftAmount(e.target.value)} placeholder="Enter total token supply" type="number" className="border-gray-300" />
                  </LabelInputContainer>
                </form>
              )}
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => { resetNFTForm(); setShowNFTDialog(false); }} className="border-gray-300">
                Cancel
              </Button>
              {mintStep === 1 ? (
                <Button 
  type="button" 
  onClick={() => {
    if (!nftTitle || !nftDescription || nftImageFiles.length === 0) {
      toast.error('Please fill all required fields and upload documentation');
      return;
    }
    setMintStep(2);
  }} 
  className="bg-blue-600 text-white hover:bg-blue-700"
>
  Configure Token
</Button>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={() => setMintStep(1)} className="border-gray-300">
                    Back
                  </Button>
                  <Button 
    type="button"
    onClick={() => {
      if (!nftId || !nftAmount) {
        toast.error('Please configure all token parameters');
        return;
      }
      handleMintNFT();
    }}
    disabled={isMinting}
    className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
  >
    <div className="flex items-center space-x-2">
      {isMinting && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      <span>{isMinting ? 'Creating Token...' : 'Create Asset Token'}</span>
    </div>
  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* List Asset Dialog */}
      <Dialog open={showListDialog} onOpenChange={setShowListDialog}>
          <DialogContent className="sm:max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl p-6 md:p-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 mb-2">List Asset on Marketplace</DialogTitle>
              <DialogDescription className="text-base text-gray-600 mb-4">Configure your asset listing for the global marketplace.</DialogDescription>
            </DialogHeader>
            <form className="my-6 space-y-5" onSubmit={handleListAsset}>
              <LabelInputContainer>
                <Label htmlFor="listTokenId">Token ID</Label>
                <Input id="listTokenId" value={listTokenId} onChange={e => setListTokenId(e.target.value)} placeholder="Enter token ID to list" type="number" className="border-gray-300" />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="listAmount">Quantity to List</Label>
                <Input id="listAmount" value={listAmount} onChange={e => setListAmount(e.target.value)} placeholder="Number of tokens to list" type="number" className="border-gray-300" />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="listPrice">Price per Token</Label>
                <Input id="listPrice" value={listPrice} onChange={e => setListPrice(e.target.value)} placeholder="Price in USD" type="number" className="border-gray-300" />
              </LabelInputContainer>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowListDialog(false)} className="border-gray-300">Cancel</Button>
                <Button type="submit" disabled={isListingAsset} className="bg-green-600 text-white hover:bg-green-700">
                  {isListingAsset ? 'Listing Asset...' : 'List on Marketplace'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Success Dialog for Minting NFT */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md rounded-xl border border-gray-200 bg-white shadow-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 mb-2">Asset Token Created!</DialogTitle>
              <DialogDescription className="text-base text-gray-600 mb-4">
                Your asset has been successfully tokenized and deployed to the blockchain.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Asset Token ID</span>
                  <span className="text-lg font-semibold text-gray-900 break-all">{mintedAssetId}</span>
                </div>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(mintedAssetId)} className="border-gray-300">
                  <Copy className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
              <Button asChild variant="default" onClick={() => { setShowSuccessDialog(false); setMintedAssetId(null); }} className="bg-blue-600 hover:bg-blue-700">
                <Link to="/issuer" className="w-full h-full">Return to Dashboard</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default Issuer;