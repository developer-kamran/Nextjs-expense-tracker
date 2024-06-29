import { getUserBalance } from '@/actions';
import { format } from '@/lib/utils';

const Balance = async () => {
  const { balance } = await getUserBalance();
  return (
    <>
      <h4>Your Balance</h4>
      <h1>${format(Number(balance?.toFixed(2) ?? 0))}</h1>
    </>
  );
};

export default Balance;
