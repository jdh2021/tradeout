import { useState } from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

const ImageUpload = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const newContractDetails = useSelector(store => store.contract.newContractDetails);
  const [imageUpload, setImageUpload] = useState(null);

  
  //Handle Image Upload
  const fileSelectedHandler = event  => {
    console.log(event.target.files[0]);
    setImageUpload(event.target.files[0]);
  }

  const sendImageToServer = (event) => {
    event.preventDefault();
    console.log('sending image to server')
    dispatch({type: 'POST_IMAGE_TO_SERVER', payload: {}, fileToUpload: imageUpload})
  }

  return (
    <div>
        <form id="imageForm" onSubmit={sendImageToServer}>
            <h4>Upload Item Image</h4>
            <input type="file" name="picture" accept="image/*" onChange={fileSelectedHandler}></input>
            <button type="submit">Upload</button>
        </form>
    </div>
  );
}

export default ImageUpload;