export const RESOURCE_NFT_ADDRESS = "0x47c7f53369Cda54407E9E127E2655D393C1EB2aE";
export const ITEM_NFT_ADDRESS = "0xDE647D4499c9Cf0B12f04AA7F8fcE0C5391F8994";
export const MAGIC_TOKEN_ADDRESS = "0x022Cd2dc689195b93DbC34179f70a0ffa69616B7";
export const CRAFTING_CONTRACT_ADDRESS = "0x4eF6c28Cc44D671d547d604705E092487c9E80f9";
export const MARKETPLACE_ADDRESS = "0xBf98217626c6471dB4a16E1A44ee5696067a612a";

// --- ABIs ---
export const ITEM_NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool approved)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function itemTypeOf(uint256 tokenId) view returns (uint8)"
];
export const MAGIC_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];
export const RESOURCE_NFT_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)"
];
export const MARKETPLACE_ABI = [
  "function sellItem(uint256 tokenId, uint256 price) public"
];

// --- Game Data ---
export const RESOURCE_LIST = [
  { name: "Wood", emoji: "🪵" },
  { name: "Iron", emoji: "⛓️" },
  { name: "Gold", emoji: "🪙" },
  { name: "Leather", emoji: "👝" },
  { name: "Stone", emoji: "🪨" },
  { name: "Diamond", emoji: "💎" },
];
export const ITEM_LIST = [
  { name: "Cossack Saber", emoji: "⚔️" },
  { name: "Elder's Staff", emoji: "🪄" },
  { name: "Charact. Armor", emoji: "🛡️" },
  { name: "Battle Bracelet", emoji: "💍" },
];
