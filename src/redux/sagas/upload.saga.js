import axios from 'axios';
import {useSelector} from 'react-redux';
import { select, put, takeLatest } from 'redux-saga/effects';




function* uploadImage(action) {

    //gets newContractDetails from redux store
    const getNewContractDetails = (store) => store.contract.newContractDetails;
    let newContractDetails = yield select(getNewContractDetails);
    console.log('newContractDetails:', newContractDetails);
    
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
            submissionData.image = imageResponse.data.imagePath;
            console.log(submissionData.image);
            //reset item_image to s3 image url
            yield put({ type: 'SET_NEW_CONTRACT_DETAILS', payload: {...newContractDetails, item_image: submissionData.image}});
        }

        // action.userAlert();
    } catch (error) {
        console.log('Error in addNewContract (saga)', error);
        alert('Something went wrong creating a new contract.');
    }
}

function* uploadSaga() {
    yield takeLatest('POST_IMAGE_TO_SERVER', uploadImage);
}

export default uploadSaga;
