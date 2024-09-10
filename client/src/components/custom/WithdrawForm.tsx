"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import trustFundJson from '@/abis/amoy/TrustFund.json';
import { useToast } from "@/hooks/use-toast";

export default function WithdrawForm() {
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const { toast } = useToast();
  const form = useForm({
    values: {
      withdrawalAddress: '',
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        trustFundJson.address,
        trustFundJson.abi,
        signer,
      );

      const txn = await contract.withdrawFunds();

      toast({ title: "Transaction sent" });

      await txn.wait();

      toast({ title: "Transaction confirmed!" });
    } catch (e: any) {
      if (e.message.includes('No funds available')) {
        return toast({ title: "No funds available to withdraw.", variant: "destructive" });
      }

      toast({ title: e.message, variant: "destructive" });
    }
  }

  const setAddress = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const withdrawalAddress = await signer.getAddress();

    form.setValue("withdrawalAddress", withdrawalAddress);
  }

  const getWithdrawalAmount = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        trustFundJson.address,
        trustFundJson.abi,
        signer,
      );
  
      const txn = await contract.getFundsAmount();
  
      const ethValue = ethers.formatEther(txn);
  
      const txn2 = await contract.getFundsWithdrawalDate();
  
      const date = new Date(parseInt(txn2) * 1000);

      if (ethValue === '0.0') {
        setWithdrawAmount(ethValue + " ETH can be withdrawn");
      } else {
        setWithdrawAmount(ethValue + " ETH can be withdrawn after " + date);
      }
    } catch (e: any) {
      console.error(e);
      toast({ title: e.message, variant: "destructive" });
      setWithdrawAmount("");
    }
  }

  useEffect(() => {
    setAddress();
    getWithdrawalAmount();

    window.ethereum.on('accountsChanged', function () {
      setAddress();
      getWithdrawalAmount();
    });
  }, []);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} >
        <Card>
          <CardHeader>
            <CardTitle>Withdraw</CardTitle>
            <CardDescription>
              Withdraw funds from the beneficiary address.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="withdrawalAddress"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Withdrawal Address</FormLabel>
                  <Input
                    id="withdrawalAddress"
                    placeholder="0x5795E7...db038"
                    value={field.value}
                    onChange={field.onChange}
                    disabled
                  />
                  <FormDescription>
                    To withdraw funds to a different address than the one seen here use Metamask to connect a different account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {withdrawAmount && (
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {withdrawAmount}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit">Withdraw</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
