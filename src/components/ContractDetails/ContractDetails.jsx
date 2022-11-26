import React, { useState } from 'react';

function ContractDetails() {
  const dispatch = useDispatch();
  const history = useHistory();
  const contractDetails = useSelector(store => store.selectedContract)
  const {contractId} = useParams();

  useEffect(() => {
    dispatch({ type: 'FETCH_CONTRACT_DETAILS', payload: contractId })
  })

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
// }

  return (
    <div>
        <h1>Contract Details</h1>
        <pre>{JSON.stringify(selectedContract)}</pre>

    </div>
  );
}
export default ContractDetails;