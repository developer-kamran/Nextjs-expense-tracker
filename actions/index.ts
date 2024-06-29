'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function getTransactions(): Promise<{
  transactions?: Transaction[];
  error?: string;
}> {
  const { userId } = auth();
  if (!userId) {
    return { error: 'User not found' };
  }
  try {
    const transactions = await db.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { transactions };
  } catch (error) {
    return { error: 'Error fetching transactions' };
  }
}

export async function addTransaction(
  formData: FormData
): Promise<TransactionResult> {
  const textValue = formData.get('text');
  const amountValue = formData.get('amount');

  if (!textValue || textValue === '' || !amountValue) {
    return { error: 'Text or amount is missing' };
  }

  const text: string = textValue.toString();
  const amount: number = parseFloat(amountValue.toString());

  const { userId } = auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    const transactionData: TransactionData = await db.transaction.create({
      data: {
        text,
        amount,
        userId,
      },
    });
    revalidatePath('/');
    return { data: transactionData };
  } catch (error) {
    return { error: 'Error adding transaction' };
  }
}

export async function editTransaction(
  transactionId: string,
  formData: FormData
): Promise<{
  message?: string;
  error?: string;
}> {
  const textValue = formData.get('text');
  const amountValue = formData.get('amount');

  if (!textValue || textValue === '' || !amountValue) {
    return { error: 'Text or amount is missing' };
  }

  const text: string = textValue.toString();
  const amount: number = parseFloat(amountValue.toString());

  const { userId } = auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    await db.transaction.update({
      where: {
        id: transactionId,
        userId,
      },
      data: {
        text,
        amount,
      },
    });
    revalidatePath('/');
    return { message: 'Transaction updated successfully!' };
  } catch (error) {
    return { error: 'Error updating transaction' };
  }
}

export async function deleteTransaction(transactionId: string): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = auth();
  if (!userId) {
    return { error: 'User not found' };
  }
  try {
    await db.transaction.delete({
      where: {
        id: transactionId,
        userId,
      },
    });
    revalidatePath('/');
    return { message: 'Transaction deleted successfully!' };
  } catch (error) {
    return { error: 'Error deleting transaction' };
  }
}

export async function getUserBalance(): Promise<{
  balance?: number;
  error?: string;
}> {
  const { userId } = auth();
  if (!userId) {
    return { error: 'User not found' };
  }
  try {
    const transactions = await db.transaction.findMany({
      where: {
        userId,
      },
    });
    const balance = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    return { balance };
  } catch (error) {
    return { error: 'Error fetching balance' };
  }
}

export async function getIncomeExpense(): Promise<{
  income?: number;
  expense?: number;
  error?: string;
}> {
  const { userId } = auth();
  if (!userId) {
    return { error: 'User not found' };
  }
  try {
    const transactions = await db.transaction.findMany({
      where: {
        userId,
      },
    });

    const amounts = transactions.map((transaction) => transaction.amount);

    const income = amounts
      .filter((amount) => amount > 0)
      .reduce((acc, amount) => acc + amount, 0);

    const expense = amounts
      .filter((amount) => amount < 0)
      .reduce((acc, amount) => acc + amount, 0);

    return { income, expense: Math.abs(expense) };
  } catch (error) {
    return { error: 'Error calculating balance' };
  }
}
