import Guest from '@/components/layout/Guest';
import { currentUser } from '@clerk/nextjs/server';
import Balance from '@/components/transaction//Balance';
import IncomeExpense from '@/components/transaction/IncomeExpense';
import AddTransaction from '@/components/transaction/AddTransaction';
import TransactionList from '@/components/transaction/TransactionList';

export default async function Home() {
  const user = await currentUser();
  if (!user) {
    return <Guest />;
  }
  return (
    <div>
      <h2>
        Welcome, <span className='user-title'>{user.firstName}</span>
      </h2>
      <Balance />
      <IncomeExpense />
      <AddTransaction />
      <TransactionList />
    </div>
  );
}
