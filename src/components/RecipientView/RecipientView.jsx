import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

function RecipientView() {
  const dispatch = useDispatch();
  // client-side URL param, corresponds to route exact path in App.jsx
  const { searchContractKey } = useParams();

  // dispatches FETCH_RECIPIENT_CONTRACT whenever searchContractKey changes
  useEffect(() => {
    dispatch({ type: 'FETCH_RECIPIENT_CONTRACT', payload: searchContractKey });
  }, [searchContractKey]);

  return (
    <div>
      <h1>RecipientView</h1>
    </div>
  );
}
export default RecipientView;