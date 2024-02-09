const initialState = {
    recipientId: "",
}

const selectedRecipientReducer = (state = initialState, action) => {
    switch (action.type){
        case 'SELECTED':
            return {
                ...state,
                recipientId: action.payload.recipientId,
            }
        default:
            return state
    }
};

export default selectedRecipientReducer;