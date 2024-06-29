'use client';
import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { handleClickOutside } from '@/lib/utils';
import { editTransaction } from '@/actions';

interface EditTransaction {
  isOpen: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  transaction: Transaction;
}

const TransactionEditDialog = ({
  isOpen,
  setShowDialog,
  transaction,
}: EditTransaction) => {
  const [text, setText] = useState(transaction.text);
  const [amount, setAmount] = useState(transaction.amount);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'text') {
      setText(value);
    } else if (name === 'amount') {
      setAmount(parseFloat(value));
    }
    setIsFormChanged(true);
  };

  const handleEditTransaction = async (formData: FormData) => {
    if (
      parseFloat(formData.get('amount') as string) == transaction.amount &&
      formData.get('text') === transaction.text
    ) {
      toast.warn('Nothing changed, Values were the same.');
      return;
    }

    const { message, error } = await editTransaction(transaction.id, formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success(message);
      setShowDialog(false);
    }
  };

  useEffect(() => {
    setText(transaction.text);
    setAmount(transaction.amount);
    setIsFormChanged(false);
  }, [transaction]);

  useEffect(() => {
    const handleOutsideClick = handleClickOutside(dialogRef, setShowDialog);
    const eventListener = handleOutsideClick as unknown as EventListener;

    if (isOpen) {
      document.addEventListener('mousedown', eventListener);
    } else {
      document.removeEventListener('mousedown', eventListener);
    }

    return () => {
      document.removeEventListener('mousedown', eventListener);
    };
  }, [isOpen, setShowDialog]);

  return (
    <div className={`dialog ${isOpen ? 'open' : ''}`}>
      <div className='dialog-content' ref={dialogRef}>
        <h3>Edit Transaction</h3>
        <form action={handleEditTransaction}>
          <div className='form-control'>
            <label htmlFor='text'>Text</label>
            <input
              type='text'
              id='text'
              name='text'
              value={text}
              onChange={handleInputChange}
              placeholder='Enter text...'
            />
          </div>
          <div className='form-control'>
            <label htmlFor='amount'>
              Amount <br /> (negative -expense, positive -income)
            </label>
            <input
              type='number'
              step='0.01'
              id='amount'
              name='amount'
              value={amount}
              onChange={handleInputChange}
              placeholder='Enter amount...'
            />
          </div>
          <div className='edit-btn-group'>
            <button className='btn' type='submit' disabled={!isFormChanged}>
              Save
            </button>
            <button className='btn' onClick={() => setShowDialog(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionEditDialog;
