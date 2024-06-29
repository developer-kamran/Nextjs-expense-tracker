'use client';

import { useRef } from 'react';
import { addTransaction } from '@/actions';
import { toast } from 'react-toastify';

const AddTransaction = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleAddTransaction = async (formData: FormData) => {
    const { data, error } = await addTransaction(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Transaction added!');
      formRef.current?.reset();
    }
  };
  return (
    <div className='add-transaction'>
      <h3>Add Transaction</h3>
      <form action={handleAddTransaction} ref={formRef}>
        <div className='form-control'>
          <label htmlFor='text'>Text</label>
          <input
            type='text'
            id='text'
            name='text'
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
            placeholder='Enter amount...'
          />
        </div>
        <button className='btn'>Add transaction</button>
      </form>
    </div>
  );
};

export default AddTransaction;
