const initialState = {
    userId: null,
    isAuthenticated: false
}

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                userId: action.payload.userId,
                isAuthenticated: true
            }
        case 'LOGOUT':
            return {
                ...state,
                userId : null,
                isAuthenticated: false
            }
        default:
            return state
    }
};

export default authReducer;