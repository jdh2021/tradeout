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

function* contractSaga() {
    yield takeLatest('FETCH_CONTRACTS', fetchContracts);
    yield takeLatest('FETCH_CONTRACT_DETAILS', fetchContractDetails);

}

function* fetchContractDetails(action){
    try{
        const contractDetails = yield axios.get(`/contract-details/${action.payload}`);
        yield put({ type: 'SET_CONTRACT_DETAILS', payload: contractDetails.data});
    } catch (error) {
        console.log('Error in fetchContractDetails (saga)', error);
        alert('Something went wrong fetching the selected contract details');
    }
}



export default contractSaga;