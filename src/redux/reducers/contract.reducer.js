import { combineReducers } from 'redux';

const defaultNewContract = {
    firstPartyType: '',
    firstPartyEmail: '',
    firstPartyName: '',
    secondPartyType: '',
    secondPartyEmail: '',
    secondPartyName: '',
    contractTitle: '',
    itemName: '',
    itemDescription: '',
    itemPrice: 0,
    pickupLocation: '',
    pickupDate: '',
    contractDeadline: '',
    contractNotes: '',
    itemImage: '',
    itemImageDescription: '',
    firstPartySignature: '',
    contractKey: '',
    contractStatus: 'pending'
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
