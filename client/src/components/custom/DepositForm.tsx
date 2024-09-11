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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import trustFundJson from '@/abis/TrustFund.json';


const trustFundAddress = process.env.NEXT_PUBLIC_TRUST_FUND_ADDRESS || '';

const validateSchema = z.object({
  beneficiaryAddress: z.string().min(1, { message: "A beneficiary is required." }),
  withdrawalDate: z.date({ required_error: "Please select a withdrawal date." }),
  depositAmount: z.string().min(1, { message: "A deposit amount is required" }),
});

const depositFormSchema = z.object({
  beneficiaryAddress: z.string(),
  withdrawalDate: z.date().or(z.undefined()),
  depositAmount: z.string(),
});


export default function DepositForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof depositFormSchema>>({
    values: {
      beneficiaryAddress: '',
      withdrawalDate: undefined,
      depositAmount: '',
    },
    resolver: zodResolver(validateSchema),
  });

  const onSubmit = async (data: z.infer<typeof validateSchema>) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      trustFundAddress,
      trustFundJson.abi,
      signer,
    );
    
    const withdrawalTimestamp = data.withdrawalDate?.getTime() / 1000;
  
    const txn = await contract.depositFunds(data.beneficiaryAddress, withdrawalTimestamp, {
      value: ethers.parseEther(data.depositAmount),
    });
  
    toast({ title: "Transaction sent" });
  
    await txn.wait();
  
    toast({ title: "Transaction confirmed!" });
  }

  return (
    <Form {...form}>
      { /* @ts-ignore */ }
      <form onSubmit={form.handleSubmit(onSubmit)} >
        <Card>
          <CardHeader>
            <CardTitle>Deposit</CardTitle>
            <CardDescription>
              Deposit funds into the trust here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="beneficiaryAddress"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Beneficiary Address</FormLabel>
                  <Input id="beneficiaryAddress" placeholder="0x5795E7...db038" value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="withdrawalDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Withdrawal Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="depositAmount"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deposit Amount</FormLabel>
                  <div className="relative">
                    <Input className="pr-20" id="depositAmount" type="number" placeholder="" value={field.value} onChange={field.onChange} />
                    <span className="absolute top-[10px] right-4 text-muted-foreground">MATIC</span>
                  </div>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Deposit</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
