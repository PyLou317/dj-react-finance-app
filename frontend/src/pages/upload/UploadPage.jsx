import { useEffect, useRef } from 'react';
import PageWrapper from '../../components/PageWrapper';
import MainTitle from '../../components/MainTitle';
import FileUploadComponent from './FileUploadComponent';
import SupportedBanksSelectionComponent from './SupportedBankSelection/SupportedBankSelectionComponent';
import UploadWrapper from './UploadStepWrapper';
import SelectAccountDropdown from './SelectAccountDropdown';
import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { fetchAccountsByOrg, fetchInstitutions } from '@/api/accounts';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export default function UploadPage() {
  const [selectedBankId, setSelectedBankId] = useState(0);
  const [selectedAccountId, setSelectedAccountId] = useState(0);
  const [stepCount, setStepCount] = useState(1);
  const step2TargetRef = useRef(null);
  const step3TargetRef = useRef(null);
  const { getToken } = useAuth();

  const {
    data: institutions,
    isPending: institutionsIsPending,
    error: institutionsError,
  } = useQuery({
    queryKey: ['institutions'],
    queryFn: async () => {
      const token = await getToken();
      return fetchInstitutions(token);
    },
    placeholderData: keepPreviousData,
  });

  const {
    data: accounts,
    isPending: accountsIsPending,
    error: accountsError,
  } = useQuery({
    queryKey: ['accounts', selectedBankId],
    queryFn: async () => {
      const token = await getToken();
      return fetchAccountsByOrg(token, selectedBankId);
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (stepCount === 2) {
      step2TargetRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (stepCount === 3) {
      step3TargetRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [stepCount]);

  return (
    <PageWrapper>
      <div className="mb-8">
        <MainTitle name="Upload Transactions" />
        <p className="text-secondary text-sm mt-1">
          Upload past transactions from your your synced instituions.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-5 p-8 rounded-2xl mb-100">
        <UploadWrapper>
          <SupportedBanksSelectionComponent
            institutions={institutions}
            setSelectedBankId={setSelectedBankId}
            setStepCount={setStepCount}
          />
        </UploadWrapper>

        {(stepCount === 2 || stepCount === 3) && (
          <UploadWrapper>
            <SelectAccountDropdown
              key={selectedBankId}
              accounts={accounts}
              setSelectedAccountId={setSelectedAccountId}
              setStepCount={setStepCount}
              ref={step2TargetRef}
            />
          </UploadWrapper>
        )}

        {stepCount === 3 && (
          <UploadWrapper>
            <FileUploadComponent
              isDisabled={
                !selectedAccountId || selectedAccountId === 'select-account'
              }
              selectedAccountId={selectedAccountId}
              ref={step3TargetRef}
            />
          </UploadWrapper>
        )}
      </div>
    </PageWrapper>
  );
}
