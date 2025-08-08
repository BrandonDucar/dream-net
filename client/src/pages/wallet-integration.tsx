import WalletDemo from '@/components/WalletDemo';
import WalletScoring from '@/components/WalletScoring';
import Head from '@/components/Head';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function WalletIntegration() {
  return (
    <>
      <Head>
        <title>Wallet Integration | Dream Network</title>
        <meta name="description" content="Cross-chain wallet integration for Ethereum and Solana in the Dream Network platform." />
        <meta property="og:title" content="Wallet Integration | Dream Network" />
        <meta property="og:description" content="Connect your Ethereum and Solana wallets for complete Dream Network access." />
        <meta property="og:type" content="website" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Wallet Overview</TabsTrigger>
              <TabsTrigger value="scoring">Trust & Agent Access</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <WalletDemo />
            </TabsContent>
            <TabsContent value="scoring">
              <WalletScoring />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}