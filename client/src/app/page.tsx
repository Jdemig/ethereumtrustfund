"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DepositForm from "@/components/custom/DepositForm";
import WithdrawForm from "@/components/custom/WithdrawForm";
import { useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const NEXT_PUBLIC_ETH_NETWORK = process.env.NEXT_PUBLIC_ETH_NETWORK;

export default function Home() {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);

  const checkNetworkAndNotify = () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    provider.getNetwork()
      .then((network) => {
        if (network.name !== NEXT_PUBLIC_ETH_NETWORK) {
          // remind the user that they need to be connected to the right network
          toast({ title: `Please change your Metamask network to ${NEXT_PUBLIC_ETH_NETWORK}`, variant: "destructive" });
        }
      });
  }

  useEffect(() => {
    if (!window.ethereum) {
      setIsMetamaskInstalled(false);
    } else {
      setIsMetamaskInstalled(true);
      checkNetworkAndNotify();

      window.ethereum.on('chainChanged', function() {
        checkNetworkAndNotify();
      });
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 py-12">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex">
        <div className="flex flex-col items-center w-[400px]">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10 w-full">
            Ethereum Trustless Fund
          </h2>

          {!isMetamaskInstalled ? (
            <Card>
              <CardHeader>
                <CardTitle>Please Install Metamask</CardTitle>
                <CardDescription>Metamask is required to use this application as well as most other Web3 applications.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Tabs defaultValue="deposit" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deposit">Deposit</TabsTrigger>
                <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              </TabsList>
              <TabsContent value="deposit">
                <DepositForm />
              </TabsContent>
              <TabsContent value="withdraw">
                <WithdrawForm />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </main>
  );
}
