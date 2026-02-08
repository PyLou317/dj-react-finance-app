import { Outlet, useParams } from 'react-router';
import TransactionsListComponent from './TransactionsListComponent';

export default function TransactionsPage() {
  const { transactionId } = useParams();

  return (
    <div>{transactionId ? <Outlet /> : <TransactionsListComponent />}</div>
  );
}
