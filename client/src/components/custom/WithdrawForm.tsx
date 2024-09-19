"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import trustFundJson from "@/abis/TrustFund.json";


const trustFundAddress = process.env.NEXT_PUBLIC_TRUST_FUND_ADDRESS || '';

type Deposit = {
    depositId: number;
    beneficiary: string;
    depositor: string;
    amount: string;
    withdrawalDate: string;
}

export default function WithdrawForm() {
    const [withdrawalAddress, setWithdrawalAddress] = useState<string>('');
    const [deposits, setDeposits] = useState<Deposit[]>([]);

    const { toast } = useToast();

    const setAddress = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const address = await signer.getAddress();

        setWithdrawalAddress(address);
    }

    const onHandleWithdraw = async (depositId: number) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                trustFundAddress,
                trustFundJson.abi,
                signer,
            );

            const txn = await contract.withdrawFunds(depositId);

            toast({ title: "Transaction sent" });

            await txn.wait();
    
            toast({ title: "Transaction confirmed!", variant: "success" });

            getWithdrawalAmounts();
        } catch (e: any) {
            if (e.message.includes('No funds available')) {
                return toast({ title: "No funds available to withdraw.", variant: "destructive" });
            }

            toast({ title: e.message, variant: "destructive" });
        }
    }

    const getWithdrawalAmounts = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
              trustFundAddress,
              trustFundJson.abi,
              signer,
            );

            const txn = await contract.getMyDeposits();

            const deposits: Deposit[] = Object.values(txn).filter((d: any) => d[3] > 0).map((d: any) => ({
                depositId: d[0],
                depositor: d[1],
                beneficiary: d[2],
                amount: ethers.formatEther(d[3]),
                withdrawalDate: new Date(parseInt(d[4]) * 1000).toLocaleDateString("en-US"),
            }));

            setDeposits(deposits);
        } catch (e: any) {
            toast({ title: e.message, variant: "destructive" });
        }
    }

    useEffect(() => {
        setAddress();
        getWithdrawalAmounts();
    
        window.ethereum.on('accountsChanged', function () {
          setAddress();
          getWithdrawalAmounts();
        });
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Withdraw</CardTitle>
                <CardDescription>
                    Withdraw funds from the beneficiary address.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="withdrawalAddress">Withdrawal Address</Label>
                    <Input
                        id="withdrawalAddress"
                        placeholder="0x5795E7...db038"
                        value={withdrawalAddress}
                        onChange={(e) => setWithdrawalAddress(e.target.value)}
                        disabled
                    />
                    <div className="text-muted-foreground">
                        To withdraw funds to a different address than the one seen here use Metamask to connect a different account.
                    </div>
                </div>

                {!!deposits.length && deposits.map((deposit, i) => (
                    <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-2 w-full">
                            <p className="text-sm text-muted-foreground text-nowrap text-ellipsis overflow-hidden">
                                <strong>Depositor: </strong> {deposit.depositor}
                            </p>
                            <p className="text-sm text-muted-foreground text-nowrap text-ellipsis overflow-hidden">
                                <strong>Beneficiary: </strong> {deposit.beneficiary} 
                            </p>
                            <p className="text-sm text-muted-foreground text-nowrap text-ellipsis overflow-hidden">
                                <strong>Amount: </strong> {deposit.amount} MATIC
                            </p>
                            <p className="text-sm text-muted-foreground text-nowrap text-ellipsis overflow-hidden">
                                <strong>Withdrawal Date: </strong> {deposit.withdrawalDate}
                            </p>
                            <Button
                                className="mt-4"
                                type="button"
                                onClick={() => onHandleWithdraw(deposit.depositId)}
                            >
                                Withdraw
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}