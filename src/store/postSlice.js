import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allPost: null, // Initially, no posts are loaded
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        // Update the reducer to directly assign the payload to state.allPost
        getAllPost: (state, action) => {
            console.log(action.payload); // Log the payload to debug
            state.allPost = action.payload; // Assign the payload directly
        },
    },
});

export const { getAllPost } = postSlice.actions;
export default postSlice.reducer;