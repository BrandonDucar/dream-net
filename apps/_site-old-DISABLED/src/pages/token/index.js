import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
const DREAM_TOKEN_ADDRESS = "0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77";
const SHEEP_TOKEN_ADDRESS = "0xDA7ec9832268606052003D7257B239C6bEDEfDf8";
const ERC20_ABI = [
    "function totalSupply() view returns (uint256)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function decimals() view returns (uint8)",
];
export default function TokenHub() {
    const [dreamStats, setDreamStats] = useState(null);
    const [sheepStats, setSheepStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchTokenStats = async () => {
            try {
                const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
                // DreamToken stats
                const dreamToken = new ethers.Contract(DREAM_TOKEN_ADDRESS, ERC20_ABI, provider);
                const dreamSupply = await dreamToken.totalSupply();
                const dreamSymbol = await dreamToken.symbol();
                const dreamName = await dreamToken.name();
                const dreamDecimals = await dreamToken.decimals();
                setDreamStats({
                    address: DREAM_TOKEN_ADDRESS,
                    symbol: dreamSymbol,
                    name: dreamName,
                    totalSupply: ethers.formatUnits(dreamSupply, dreamDecimals),
                    decimals: dreamDecimals,
                });
                // SheepToken stats
                const sheepToken = new ethers.Contract(SHEEP_TOKEN_ADDRESS, ERC20_ABI, provider);
                const sheepSupply = await sheepToken.totalSupply();
                const sheepSymbol = await sheepToken.symbol();
                const sheepName = await sheepToken.name();
                const sheepDecimals = await sheepToken.decimals();
                setSheepStats({
                    address: SHEEP_TOKEN_ADDRESS,
                    symbol: sheepSymbol,
                    name: sheepName,
                    totalSupply: ethers.formatUnits(sheepSupply, sheepDecimals),
                    decimals: sheepDecimals,
                });
            }
            catch (err) {
                console.error("Failed to fetch token stats:", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchTokenStats();
    }, []);
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white", children: _jsxs("div", { className: "max-w-6xl mx-auto px-6 py-12", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent", children: "DREAM Token" }), _jsx("p", { className: "text-xl text-gray-400 max-w-2xl mx-auto", children: "The utility token powering the DreamNet ecosystem. Earn through engagement, claim on-chain, shape the future." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-12", children: [_jsxs("div", { className: "bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-2xl border border-blue-500/30 p-8", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "text-5xl", children: "\uD83D\uDC8E" }), _jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-blue-400", children: "DREAM" }), _jsx("p", { className: "text-gray-400", children: "DreamNet Token" })] })] }), loading ? (_jsx("div", { className: "text-gray-400", children: "Loading..." })) : dreamStats ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Total Supply" }), _jsxs("div", { className: "text-2xl font-bold text-blue-300", children: [parseFloat(dreamStats.totalSupply).toLocaleString(), " ", dreamStats.symbol] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Contract" }), _jsx("a", { href: `https://basescan.org/address/${dreamStats.address}`, target: "_blank", rel: "noopener noreferrer", className: "text-cyan-400 hover:text-cyan-300 font-mono text-sm break-all", children: dreamStats.address })] }), _jsx("div", { className: "pt-4 border-t border-blue-500/20", children: _jsx("p", { className: "text-sm text-gray-300", children: "DREAM is earned through daily engagement, creative contributions, and ecosystem participation. Convert internal DREAM to on-chain tokens and use them across the DreamNet platform." }) })] })) : null] }), _jsxs("div", { className: "bg-gradient-to-br from-yellow-900/30 to-orange-900/20 rounded-2xl border border-yellow-500/30 p-8", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "text-5xl", children: "\uD83D\uDC11" }), _jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-yellow-400", children: "SHEEP" }), _jsx("p", { className: "text-gray-400", children: "Sheep Token" })] })] }), loading ? (_jsx("div", { className: "text-gray-400", children: "Loading..." })) : sheepStats ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Total Supply" }), _jsxs("div", { className: "text-2xl font-bold text-yellow-300", children: [parseFloat(sheepStats.totalSupply).toLocaleString(), " ", sheepStats.symbol] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Contract" }), _jsx("a", { href: `https://basescan.org/address/${sheepStats.address}`, target: "_blank", rel: "noopener noreferrer", className: "text-yellow-400 hover:text-yellow-300 font-mono text-sm break-all", children: sheepStats.address })] }), _jsx("div", { className: "pt-4 border-t border-yellow-500/20", children: _jsx("p", { className: "text-sm text-gray-300", children: "SHEEP is the soft currency of DreamNet. Earned through daily activities, used for cosmetic features, and non-tradable fun currency for the ecosystem." }) })] })) : null] })] }), _jsxs("div", { className: "bg-gray-900/50 rounded-2xl border border-white/10 p-8 mb-12", children: [_jsx("h2", { className: "text-3xl font-bold mb-6 text-center", children: "How to Earn DREAM" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDCC5" }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: "Daily Claims" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Claim daily rewards and build streaks for bonus multipliers" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83C\uDFA8" }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: "Create Content" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Upload media, create dreams, contribute to the ecosystem" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDD17" }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: "Refer Friends" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Invite others and earn DREAM when they join" })] })] }), _jsx("div", { className: "text-center mt-8", children: _jsx("a", { href: "/miniapps/rewards", className: "inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition", children: "Start Earning \u2192" }) })] }), _jsxs("div", { className: "bg-gray-900/50 rounded-2xl border border-white/10 p-8", children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "Tokenomics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 text-blue-400", children: "DREAM Token" }), _jsxs("ul", { className: "space-y-2 text-gray-300", children: [_jsx("li", { children: "\u2022 Max Supply: 1,000,000,000 DREAM" }), _jsx("li", { children: "\u2022 Decimals: 18" }), _jsx("li", { children: "\u2022 Network: Base Mainnet" }), _jsx("li", { children: "\u2022 Standard: ERC-20" }), _jsx("li", { children: "\u2022 Distribution: Rewards-based" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 text-yellow-400", children: "SHEEP Token" }), _jsxs("ul", { className: "space-y-2 text-gray-300", children: [_jsx("li", { children: "\u2022 Max Supply: 1,000,000,000 SHEEP" }), _jsx("li", { children: "\u2022 Decimals: 18" }), _jsx("li", { children: "\u2022 Network: Base Mainnet" }), _jsx("li", { children: "\u2022 Standard: ERC-20" }), _jsx("li", { children: "\u2022 Type: Soft currency (non-tradable)" })] })] })] })] })] }) }));
}
