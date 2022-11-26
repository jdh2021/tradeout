import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchContractDetails(){
    try{
        const contractDetails = yield axios.get(`/contract-details/${action.payload}`);
        yield put({ type: 'SET_CONTRACT_DETAILS', payload: contractDetails.data});
    } catch (error) {
        console.log('Error in fetchContractDetails (saga)', error);
        alert('Something went wrong fetching the selected contract details');
    }
}

function* detailsSaga(){
    yield takeLatest('FETCH_CONTRACT_DETAILS', fetchContractDetails);
    
}

export default detailsSaga;