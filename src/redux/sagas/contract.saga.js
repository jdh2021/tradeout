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


// item_image is the image path (on AWS)
// image_data is the selected file data (before uploading)
// item_preview is the local image preview
function* addNewContract(action) {
    // payload is the newContractDetails object
    // SendGrid request will be called after successful new contract post
    try {
        console.log('in uploadImage (saga)', action.payload);
        const submissionData = Object.assign({}, action.payload);
        if (action.fileToUpload) {
            const selectedFile = action.fileToUpload;
            const fileName = encodeURIComponent(selectedFile.name);
            const fileType = encodeURIComponent(selectedFile.type);
            const fileSize = encodeURIComponent(selectedFile.size);
            const formData = new FormData();
            formData.append('fileToUpload', selectedFile);
            const imageResponse = yield axios.post(`/api/s3/image?name=${fileName}&type=${fileType}&size=${fileSize}`, formData);
            submissionData.item_image = imageResponse.data.imagePath;
            console.log(submissionData.item_image);
        }

        console.log('in addNewContract (saga)', submissionData);
        yield axios.post('/api/contract', submissionData);
        yield put ({type: 'FETCH_CONTRACTS'});
        // SendGrid email request:
        console.log('sending to sendGrid',action.userAlert);
        yield axios.post('/api/sendgrid', submissionData);
        // user is told the contract post and email were successful
        console.log('resetting user contract details');

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




function* contractSaga() {
    yield takeLatest('FETCH_CONTRACTS', fetchContracts);
    yield takeLatest('FETCH_CONTRACT_DETAILS', fetchContractDetails);
    yield takeLatest('FETCH_RECIPIENT_CONTRACT', fetchRecipientContract);
    yield takeLatest('ADD_NEW_CONTRACT', addNewContract);
    yield takeLatest('UPDATE_CONTRACT_STATUS', updateContractStatus);
    yield takeLatest('FINALIZE_CONTRACT', finalizeContract);
   

}

export default contractSaga;
