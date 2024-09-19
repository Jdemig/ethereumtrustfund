"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DepositForm from "@/components/custom/DepositForm";
import WithdrawForm from "@/components/custom/WithdrawForm";
import { useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "@/hooks/use-toast";

const NEXT_PUBLIC_ETH_NETWORK = process.env.NEXT_PUBLIC_ETH_NETWORK;

export default function Home() {
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
    checkNetworkAndNotify();

    window.ethereum.on('chainChanged', function() {
      checkNetworkAndNotify();
    });
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <div className="flex flex-col items-center w-[400px]">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10 w-full">
            Ethereum Trustless Fund
          </h2>

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
        </div>
      </div>
    </main>
  );
}
