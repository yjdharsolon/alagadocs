
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TransactionHistory } from '@/services/billingService';
import { Skeleton } from '@/components/ui/skeleton';

interface TransactionHistoryProps {
  transactions: TransactionHistory[];
  isLoading: boolean;
}

export default function TransactionHistoryComponent({ transactions, isLoading }: TransactionHistoryProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent billing transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent billing transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No transactions found.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent billing transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="capitalize">
                  {transaction.plan_id.replace('-', ' ')}
                </TableCell>
                <TableCell className="capitalize">
                  {transaction.payment_method.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  {formatCurrency(transaction.amount, transaction.currency)}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
