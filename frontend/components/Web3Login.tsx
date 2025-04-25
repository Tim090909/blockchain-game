'use client';

'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import {
  MAGIC_TOKEN_ADDRESS, RESOURCE_NFT_ADDRESS, CRAFTING_CONTRACT_ADDRESS,
  ITEM_NFT_ADDRESS, MARKETPLACE_ADDRESS,
  ITEM_NFT_ABI, MAGIC_TOKEN_ABI, RESOURCE_NFT_ABI, MARKETPLACE_ABI,
  RESOURCE_LIST, ITEM_LIST
} from '@/data/constants';
import { detectEvmWallets, EvmWalletInfo } from '../utils/wallet';



const Web3Login: React.FC = () => {
  const [step, setStep] = useState<'idle' | 'select' | 'connected'>('idle');
  const [availableWallets, setAvailableWallets] = useState<EvmWalletInfo[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<EvmWalletInfo | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [magicTokenBalance, setMagicTokenBalance] = useState<string | null>(null);
  const [resourceBalances, setResourceBalances] = useState<string[]>([]);
  const [itemCounts, setItemCounts] = useState<number[]>([0, 0, 0, 0]);
  const [itemTokens, setItemTokens] = useState<number[][]>([[], [], [], []]);

  // --- Connect Wallet ---
  const handleLoginClick = () => {
    setError(null); setTxHash(null);
    const wallets = detectEvmWallets();
    if (wallets.length === 0) {
      setError("No EVM wallet detected. Please install MetaMask or Phantom (EVM enabled).");
      return;
    }
    setAvailableWallets(wallets); setStep('select');
  };

  const handleWalletSelect = async (wallet: EvmWalletInfo) => {
    setSelectedWallet(wallet); setError(null); setTxHash(null);
    try {
      const accounts = await wallet.provider.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]); setStep('connected');
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet.");
    }
  };

  // --- Fetch balances and owned NFTs on connect or txHash change ---
  useEffect(() => {
    if (!walletAddress || !selectedWallet) {
      setEthBalance(null);
      setMagicTokenBalance(null);
      setResourceBalances([]);
      setItemCounts([0, 0, 0, 0]);
      setItemTokens([[], [], [], []]);
      return;
    }
    (async () => {
      try {
        const provider = new ethers.BrowserProvider(selectedWallet.provider);

        // ETH balance
        const balance = await provider.getBalance(walletAddress);
        setEthBalance(ethers.formatEther(balance));

        // MagicToken
        const magicToken = new ethers.Contract(MAGIC_TOKEN_ADDRESS, MAGIC_TOKEN_ABI, provider);
        const mtBal = await magicToken.balanceOf(walletAddress);
        setMagicTokenBalance(ethers.formatUnits(mtBal, 18));

        // Resources (ERC1155)
        const resourceNFT = new ethers.Contract(RESOURCE_NFT_ADDRESS, RESOURCE_NFT_ABI, provider);
        const resourcePromises = RESOURCE_LIST.map((_, idx) =>
          resourceNFT.balanceOf(walletAddress, idx)
        );
        const resourceResults = await Promise.all(resourcePromises);
        setResourceBalances(resourceResults.map(b => b.toString()));

        // Items (ERC721)
        const itemNFT = new ethers.Contract(ITEM_NFT_ADDRESS, ITEM_NFT_ABI, provider);
        const itemCount = await itemNFT.balanceOf(walletAddress);
        const ids: number[] = [];
        for (let i = 0; i < itemCount; i++) {
          const tokenId = await itemNFT.tokenOfOwnerByIndex(walletAddress, i);
          ids.push(Number(tokenId));
        }
        // Map tokens to type
        const counts = [0, 0, 0, 0];
        const groupedTokens: number[][] = [[], [], [], []];
        for (const id of ids) {
          const typeBigInt = await itemNFT.itemTypeOf(id);
          const type = Number(typeBigInt);
          if (type >= 1 && type <= 4) {
            counts[type - 1]++;
            groupedTokens[type - 1].push(id);
          }
        }
        setItemCounts(counts);
        setItemTokens(groupedTokens);

      } catch (e: any) {
        setError("Failed to fetch balances: " + (e?.message || e));
      }
    })();
  }, [walletAddress, selectedWallet, txHash]);

  // --- Smart contract button actions ---
  const sendGameTx = async (methodSig: string) => {
    if (!selectedWallet || !walletAddress) return;
    try {
      setError(null); setTxHash(null);
      const contract = new ethers.Interface([methodSig]);
      const fnName = methodSig.match(/function (\w+)\(/)?.[1];
      const data = contract.encodeFunctionData(fnName!, []);
      const hash = await selectedWallet.provider.request({
        method: "eth_sendTransaction",
        params: [{
          from: walletAddress,
          to: CRAFTING_CONTRACT_ADDRESS,
          data,
        }],
      });
      setTxHash(hash);
    } catch (err: any) {
      setError(err.message || "Transaction failed.");
    }
  };

  // Game action buttons
  const craftFns = [
    () => sendGameTx("function craftCossackSaber()"),
    () => sendGameTx("function craftEldersStaff()"),
    () => sendGameTx("function craftCharacternykArmor()"),
    () => sendGameTx("function craftBattleBracelet()")
  ];

  // --- Sell item handler ---
  const handleSellItem = async (itemType: number) => {
    if (!selectedWallet || !walletAddress) return;
    if (!itemTokens[itemType].length) {
      setError("You do not own this item yet.");
      return;
    }
    let tokenId = itemTokens[itemType][0];
    if (itemTokens[itemType].length > 1) {
      const userTokenId = prompt(`Enter token ID to sell (${itemTokens[itemType].join(', ')}):`, itemTokens[itemType][0].toString());
      if (!userTokenId) return;
      tokenId = Number(userTokenId);
    }
    const priceRaw = prompt("Enter sale price in MagicToken (e.g., 1):", "1");
    if (!priceRaw) return;
  
    try {
      setError(null); setTxHash(null);
      const provider = new ethers.BrowserProvider(selectedWallet.provider);
      const signer = await provider.getSigner(walletAddress);
      const itemNFT = new ethers.Contract(ITEM_NFT_ADDRESS, ITEM_NFT_ABI, signer);

      // 1. Check approval
      const isApproved = await itemNFT.isApprovedForAll(walletAddress, MARKETPLACE_ADDRESS);
      if (!isApproved) {
        const txApprove = await itemNFT.setApprovalForAll(MARKETPLACE_ADDRESS, true);
        await txApprove.wait();
      }

      // 2. Sell
      const iface = new ethers.Interface(MARKETPLACE_ABI);
      const price = ethers.parseUnits(priceRaw, 18);
      const data = iface.encodeFunctionData("sellItem", [tokenId, price]);
      const hash = await selectedWallet.provider.request({
        method: "eth_sendTransaction",
        params: [{
          from: walletAddress,
          to: MARKETPLACE_ADDRESS,
          data,
        }],
      });
      setTxHash(hash);
    } catch (err: any) {
      setError(err.message || "Sell transaction failed.");
    }
  };

  // --- Transfer item handler ---
  const transferItem = async (itemType: number) => {
    if (!selectedWallet || !walletAddress) return;
    if (!itemTokens[itemType].length) {
      setError("You do not own this item yet.");
      return;
    }
    let tokenId = itemTokens[itemType][0];
    if (itemTokens[itemType].length > 1) {
      const userTokenId = prompt(`Enter token ID to send (${itemTokens[itemType].join(', ')}):`, itemTokens[itemType][0].toString());
      if (!userTokenId) return;
      tokenId = Number(userTokenId);
    }
    const toAddress = prompt("Enter recipient address:");
    if (!toAddress) return;

    try {
      setError(null);
      const provider = new ethers.BrowserProvider(selectedWallet.provider);
      const signer = await provider.getSigner(walletAddress);
      const itemNFT = new ethers.Contract(ITEM_NFT_ADDRESS, ITEM_NFT_ABI, signer);

      const tx = await itemNFT["safeTransferFrom(address,address,uint256)"](walletAddress, toAddress, tokenId);
      await tx.wait();
      setTxHash(tx.hash);
      alert("NFT sent!");
    } catch (err: any) {
      setError("Transfer failed: " + (err.message || err));
    }
  };

  // --- Render
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      {step === 'idle' && (
        <>
          <button
            onClick={handleLoginClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-800"
          >
            Увійти через Web3
          </button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </>
      )}
      {step === 'select' && (
        <>
          <p className="mb-4 text-lg">Select a wallet to connect:</p>
          <div className="flex flex-col gap-6">
            {availableWallets.map((wallet, i) => (
              <button
                key={i}
                onClick={() => handleWalletSelect(wallet)}
                className="flex flex-row w-80 items-center justify-center p-4 gap-4 bg-gray-800 rounded-xl hover:bg-gray-700"
              >
                <span className="text-2xl">{wallet.icon}</span>
                <span>{wallet.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep('idle')}
            className="mt-8 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
          >
            Back
          </button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </>
      )}
      {step === 'connected' && walletAddress && selectedWallet && (
        <div className="w-full flex flex-col items-center">
          <p className="mb-2 text-green-700 font-semibold">
            {selectedWallet.name} connected!
          </p>
          <div className='flex flex-row gap-4 items-center'>
            <div className="break-all">Address: {walletAddress}</div>
            <button
              onClick={() => {
                setStep('idle');
                setWalletAddress(null);
                setSelectedWallet(null);
                setError(null);
                setTxHash(null);
              }}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Disconnect
            </button>
          </div>
          <div className="mt-4 flex flex-col items-center gap-3">
            <div><strong>ETH:</strong> {ethBalance ?? "..."}</div>
            <div><strong>MagicToken:</strong> {magicTokenBalance ?? "..."}</div>
            <div className="w-full flex flex-col items-center">
              <div className='flex flex-row gap-4 items-center'>
                <strong>Resources:</strong>
                <button onClick={() => sendGameTx("function searchResources()")} className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-700">🔍 Search for Resources</button>
              </div>
              <div className='flex flex-row flex-wrap gap-2 justify-center mt-4'>
                {RESOURCE_LIST.map((res, i) => (
                  <div key={i} className="flex flex-col items-center border rounded-lg bg-gray-700 p-3 w-28 h-24 shadow-sm">
                    <span className="text-3xl">{res.emoji}<span className="text-lg">x {resourceBalances[i] ?? "0"}</span></span>
                    <span className="font-semibold mt-3">{res.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex flex-col items-center mt-4">
              <strong>Crafted Items:</strong>
              <div className='flex flex-row flex-wrap gap-2 justify-center mt-2'>
                {ITEM_LIST.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center border rounded-lg bg-yellow-600 p-3 w-40 h-32 shadow relative"
                  >
                    <span className="text-3xl">{item.emoji}<span className="font-semibold text-xl">x {itemCounts[i]}</span></span>
                    <span className="font-bold mt-2 text-sm text-center">{item.name}</span>
                    <div className='w-36 absolute bottom-2 left-2 flex flex-row items-center justify-between'>
                    <button
                      onClick={craftFns[i]}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Craft
                    </button>
                    <button
                      onClick={() => handleSellItem(i)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-700"
                    >
                      Sell
                    </button>
                    <button
                      onClick={() => transferItem(i)}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-700"
                    >
                      Send
                    </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {txHash && (
            <div className="mt-2 text-blue-700 text-sm break-all">
              Transaction: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
            </div>
          )}
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Web3Login;
