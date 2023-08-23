"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const handleLogin = (user: any) => {
  console.log(`User ${user.id} logged in!`);
};

function PrivyProviderB({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      onSuccess={handleLogin}
      config={{
        loginMethods: [
          "wallet",
          "email",
          "google",
          "twitter",
          "apple",
          "discord",
          "github",
        ],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://thumbs.dreamstime.com/b/demo-rubber-stamp-grunge-design-dust-scratches-effects-can-be-easily-removed-clean-crisp-look-color-easily-changed-82616276.jpg",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

export default PrivyProviderB;
