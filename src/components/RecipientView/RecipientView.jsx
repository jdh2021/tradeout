import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ContractPreview from '../ContractPreview/ContractPreview';

function RecipientView() {
  const dispatch = useDispatch();
  // client-side URL param, corresponds to route exact path in App.jsx
  const { searchContractKey } = useParams();
  const contractDetails = useSelector(store => store.contract.selectedContract)

  // dispatches FETCH_RECIPIENT_CONTRACT whenever searchContractKey changes
  useEffect(() => {
    dispatch({ type: 'FETCH_RECIPIENT_CONTRACT', payload: searchContractKey });
  }, [searchContractKey]);

  return (
    <div>
      <h1>RecipientView</h1>
      <ContractPreview contractDetails={contractDetails} />
    </div>
  );
}
export default RecipientView;