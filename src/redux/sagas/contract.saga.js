import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchContracts() {
    try {
        const contracts = yield axios.get('/api/contract');
        yield put({ type: 'SET_CONTRACTS', payload: contracts.data });
    } catch (error) {
        console.log('Error in fetchContracts (saga)', error);
        alert('Something went wrong fetching the contracts');
    }
}

function* fetchContractDetails(action){
    try{
        const contractDetails = yield axios.get(`/api/contract/${action.payload}`);
        yield put({ type: 'SET_CONTRACT_DETAILS', payload: contractDetails.data});
        action.checkForUserAction(contractDetails.data);
    } catch (error) {
        console.log('Error in fetchContractDetails (saga)', error);
        alert('Something went wrong fetching the selected contract details');
    }
}

function* fetchRecipientContract(action) {
    // payload is contract_key entered by recipient
    try {
        console.log('in fetchRecipientContract (saga)');
        const recipientContract = yield axios.get(`/api/recipient/${action.payload}`);
        yield put({ type: 'SET_RECIPIENT_CONTRACT', payload: recipientContract.data });
    } catch (error) {
        console.log('Error in fetchRecipientContract (saga)', error);
        alert('Something went wrong fetching the recipient contract');
    }     
}

function* addNewContract(action) {
    // payload is the newContractDetails object
    // SendGrid request will be called after successful new contract post
    try {
        console.log('in addNewContract (saga)', action.payload);
        yield axios.post('/api/contract', action.payload);
        yield put ({type: 'FETCH_CONTRACTS'});
        // SendGrid email request:

        yield axios.post('/api/sendgrid', action.payload);
        // user is told the contract post and email were successful

        // yield axios.post('/api/sendgrid', action.payload);
        // clearing contract details from newContractDetails reducer
          yield put ({type: 'SET_DEFAULT_CONTRACT'});
        // user is told the contract post and email were successfull

        action.userAlert();
    } catch (error) {
        console.log('Error in addNewContract (saga)', error);
        alert('Something went wrong creating a new contract.');
    }
}

function* updateContractStatus(action) {
    // payload is contract object that includes updated properties for signature and contract status
    try {
        console.log('in updateContractStatus (saga). Contract object to update is:', action.payload);
        yield axios.put('/api/contract', action.payload);
        action.handleContractStatusUpdate();
    } catch (error) {
        console.log('Error in updateContractStatus (saga)', error);
        alert('Something went wrong updating the contract status.');
    }   
}

function* finalizeContract(action) {
    // payload is contract object that includes updated properties for signature and contract status
    try {
        console.log('in finalizeContract (saga). Contract object to update is:', action.payload);
        yield axios.put('/api/contract', action.payload);
        // trigger PDF generation, payload is the selected contract's id
        // yield put ({type: 'GENERATE_PDF', payload: action.payload.id});
        action.userAlert();
    } catch (error) {
        console.log('Error in finalizeContract saga', error);
        alert('Something went wrong finalizing this contract.');
    }
}

function* generatePDF(action){
    try{
        const pdfDetails = yield axios.get(`/api/contract/make/pdf/${action.payload}`);
    } catch (error) {
        console.log('Error in generatePDF (saga)', error);
        alert('Something went wrong fetching the selected contract details for pdf');
    }
}

function* fetchPDFDetails(action){
    try{
        const pdfDetails = yield axios.get(`/api/contract/${action.payload}`);
        yield put({ type: 'SET_CONTRACT_DETAILS', payload: pdfDetails.data});
    } catch (error) {
        console.log('Error in fetchPDFDetails (saga)', error);
        alert('Something went wrong fetching the selected contract details for pdf');
    }
}


function* contractSaga() {
    yield takeLatest('FETCH_CONTRACTS', fetchContracts);
    yield takeLatest('FETCH_CONTRACT_DETAILS', fetchContractDetails);
    yield takeLatest('FETCH_RECIPIENT_CONTRACT', fetchRecipientContract);
    yield takeLatest('ADD_NEW_CONTRACT', addNewContract);
    yield takeLatest('UPDATE_CONTRACT_STATUS', updateContractStatus);
    yield takeLatest('FINALIZE_CONTRACT', finalizeContract);
    yield takeLatest('GENERATE_PDF',generatePDF);
    yield takeLatest('FETCH_PDF_DETAILS',fetchPDFDetails);

}

export default contractSaga;
