"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DepositForm from "@/components/custom/DepositForm";
import WithdrawForm from "@/components/custom/WithdrawForm";


export default function Home() {
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
