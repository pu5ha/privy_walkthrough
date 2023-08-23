"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignMessage from "../components/SignMessage";
import SendTransaction from "../components/SendTransaction";
import { ethers } from "ethers";

function LoggedIn() {
  const {
    ready,
    authenticated,
    logout,
    user,
    linkWallet,
    linkEmail,
    linkApple,
    linkDiscord,
    linkGithub,
    linkGoogle,
    linkPhone,
    linkTwitter,
    signMessage,
    sendTransaction,
  } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();
  const [selectedLink, setSelectedLink] = useState<string>("");
  const [embeddedWallet, setEmbeddedWallet] = useState<any>();
  const [walletBalance, setWalletBalance] = useState<string>("");

  useEffect(() => {
    if (!ready) {
      return;
    } else {
      setUp();
    }
    async function setUp() {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );
      if (embeddedWallet) {
        const provider = await embeddedWallet.getEthereumProvider();
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(11155111).toString(16)}` }],
        });
        const ethProvider = new ethers.providers.Web3Provider(provider);
        const walletBalance = await ethProvider.getBalance(
          embeddedWallet.address
        );
        const ethStringAmount = ethers.utils.formatEther(walletBalance);
        setEmbeddedWallet(embeddedWallet);
        setWalletBalance(ethStringAmount);
      }
    }
  }, [ready, wallets]);

  if (ready && !authenticated) router.push("/");

  if (!user) return <></>;

  const linkOptions = [
    { label: "Email", action: linkEmail },
    { label: "Wallet", action: linkWallet },
    { label: "Apple", action: linkApple },
    { label: "Discord", action: linkDiscord },
    { label: "Github", action: linkGithub },
    { label: "Google", action: linkGoogle },
    { label: "Phone", action: linkPhone },
    { label: "Twitter", action: linkTwitter },
  ];

  const handleLinkClick = () => {
    const selected = linkOptions.find(
      (option) => option.label === selectedLink
    );
    if (selected) {
      selected.action();
    }
  };

  return (
    <div className="p-8">
      <p className="text-xl font-semibold">Logged in</p>
      <p className="mb-4">User {user.id} has linked the following accounts:</p>
      <ul className="list-inside list-disc mb-4">
        <li>Email: {user.email ? user.email.address : "None"}</li>
        <li>Wallet: {user.wallet ? user.wallet.address : "None"}</li>
        <li>Google: {user.google ? user.google.email : "None"}</li>
        <li>Discord: {user.discord ? user.discord.username : "None"}</li>
        <li>Twitter: {user.twitter ? user.twitter.username : "None"}</li>
        <li>Github: {user.github ? user.github.username : "None"}</li>
        <li>Phone: {user.phone ? user.phone.number : "None"}</li>
      </ul>
      <div className="mb-5">
        <select
          value={selectedLink}
          onChange={(e) => setSelectedLink(e.target.value)}
          className="border rounded mr-2 p-2"
        >
          <option>Select an account to link</option>
          {linkOptions.map((option, index) => (
            <option key={index} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleLinkClick}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
        >
          Link Selected Account
        </button>
      </div>
      <p>The Address of the Embedded Wallet is {embeddedWallet?.address}</p>
      {walletBalance && <p>With a Balance of {walletBalance}ETH</p>}
      <SignMessage signMessage={signMessage} user={user} />
      <SendTransaction sendTransaction={sendTransaction} user={user} />
      <div>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default LoggedIn;
