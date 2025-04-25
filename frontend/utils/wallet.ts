export type EvmWalletInfo = {
    name: string;
    icon: string;
    provider: any;
    isMetaMask?: boolean;
    isPhantom?: boolean;
};
  
export function detectEvmWallets(): EvmWalletInfo[] {
    if (typeof window === "undefined" || !(window as any).ethereum) return [];
    const eth = (window as any).ethereum;
    const providers = eth.providers || [eth];
    const wallets: EvmWalletInfo[] = [];
    for (const provider of providers) {
      if (provider.isMetaMask) wallets.push({ name: "MetaMask", icon: "🦊", provider, isMetaMask: true });
      else if (provider.isPhantom) wallets.push({ name: "Phantom", icon: "👻", provider, isPhantom: true });
      else wallets.push({ name: "Unknown Wallet", icon: "💼", provider });
    }
    const unique = wallets.filter((w, idx, arr) => arr.findIndex(x => x.name === w.name) === idx);
    return unique;
}
  