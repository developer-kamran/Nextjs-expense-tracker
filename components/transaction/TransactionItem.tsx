'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { format } from '@/lib/utils';
import { deleteTransaction } from '@/actions';
import EditTransaction from './EditTransaction';

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const [showDialog, setShowDialog] = useState(false);

  const sign = transaction.amount < 0 ? '-' : '+';

  const openDialog = () => {
    setShowDialog(true);
  };

  const handleDeleteTransaction = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this transaction?'
    );
    if (!confirmed) {
      return;
    }
    const { message, error } = await deleteTransaction(transaction.id);

    if (error) {
      toast.error(error);
    } else {
      toast.success(message);
    }
  };

  return (
    <>
      <li className={transaction.amount < 0 ? 'minus' : 'plus'}>
        <div className='transaction-info'>
          {transaction.text}
          <span>
            {sign}${format(Math.abs(transaction.amount))}
          </span>
        </div>
        <div className='btn-group'>
          <button className='delete-btn' onClick={handleDeleteTransaction}>
            x
          </button>
          <button className='edit-btn' onClick={openDialog}>
            &#9998;
          </button>
        </div>
      </li>
      {showDialog && (
        <EditTransaction
          isOpen={showDialog}
          setShowDialog={setShowDialog}
          transaction={transaction}
        />
      )}
    </>
  );
};

export default TransactionItem;
