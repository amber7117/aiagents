'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loggedInUser } from '@/lib/data';
import { useState } from 'react';
import { DollarSign } from 'lucide-react';

export default function WalletPage() {
  const [balance, setBalance] = useState(loggedInUser.balance || 0);
  const [amount, setAmount] = useState('');

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    const addAmount = parseFloat(amount);
    if (!isNaN(addAmount) && addAmount > 0) {
      setBalance(balance + addAmount);
      setAmount('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your balance and view transaction history.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
            <CardDescription>Your available funds.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-muted-foreground" />
              <p className="text-4xl font-bold">
                ${balance.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Funds</CardTitle>
            <CardDescription>
              Add money to your wallet. (This is a simulation)
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAddFunds}>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 50.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Add Funds</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
