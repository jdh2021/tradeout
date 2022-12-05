import { combineReducers } from 'redux';

const defaultNewContract = {
    first_party_type: '',
    first_party_email: '',
    first_party_name: '',
    second_party_type: '',
    second_party_email: '',
    second_party_email: '',
    contract_title: '',
    item_name: '',
    item_description: '',
    item_price: 0,
    item_pickup_location: '',
    item_pickup_date: '',
    contract_deadline: '',
    contract_notes: '',
    item_image: '',
    item_image_description: '',
    first_party_signature: '',
    contract_key: '',
    contract_status: 'pending_second_party_response'
};

const newContractDetails = (state = defaultNewContract, action) => {
    console.log('in newContractDetails reducer');
    if(action.type === 'SET_NEW_CONTRACT_DETAILS') {
        return action.payload;
    } else if (action.type === 'UNSET_USER' || action.type === 'SET_DEFAULT_CONTRACT') {
        return defaultNewContract;
    }
    return state;
}

const userContracts = (state = [], action) => {
    console.log('in userContracts reducer');
    if(action.type === 'SET_CONTRACTS') {
        return action.payload;
    } else if (action.type === 'UNSET_USER') {
        return [];
    }
    return state;
  };

//reducer for specific contract user selects
const selectedContract = (state = {}, action) => {
    console.log('in selectedContract reducer');
    if(action.type === 'SET_CONTRACT_DETAILS') {
        return action.payload;
    } else if (action.type === 'SET_RECIPIENT_CONTRACT') {
        return action.payload;
    } else if (action.type === 'UNSET_USER') {
        return {};
    }
    return state;
  }

const contractKey = (state = '', action) => {
    console.log('in contractKey reducer');
    if (action.type === 'SET_CONTRACT_KEY') {
        return action.payload;
    } else if (action.type === 'UNSET_USER') {
        return '';
    }
    return state;
}  

export default combineReducers({
    newContractDetails,
    userContracts,
    selectedContract,
    contractKey,
});
