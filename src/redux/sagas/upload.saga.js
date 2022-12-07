import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';



function* uploadImage(action) {
    // payload is the newContractDetails object
    // SendGrid request will be called after successful new contract post
    try {
        console.log('in addNewContract (saga)', action.payload);
        const submissionData = Object.assign({}, action.payload);
        if (action.fileToUpload) {
            const selectedFile = action.fileToUpload;
            const fileName = encodeURIComponent(selectedFile.fileName);
            const fileType = encodeURIComponent(selectedFile.type);
            const fileSize = encodeURIComponent(selectedFile.size);
            const formData = new FormData();
            formData.append('fileToUpload', selectedFile);
            const imageResponse = yield axios.post(`/api/s3/image?name=${fileName}&type=${fileType}&size=${fileSize}`, formData);
            submissionData.image = imageResponse.data.imagePath;
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
