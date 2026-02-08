import type { Metadata } from 'next';
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from './providers';
import FarcasterWrapper from "@/components/FarcasterWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en">
          <body>
            <Providers>
      <FarcasterWrapper>
        {children}
      </FarcasterWrapper>
      </Providers>
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "TimeLock Playground",
        description: "Convert time into onchain assets. Lock tokens for unique durations to earn 'time NFTs', countdowns, perks, and airdrops. Trade time locks like collectibles for exclusive rewards.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_af1c102b-0416-46a0-b53d-742987668e12-pacNNho0N3mEX4n7r0LhIiuRx6TJZG","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"TimeLock Playground","url":"https://smaller-baseball-925.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
