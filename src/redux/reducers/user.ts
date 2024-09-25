import {createSlice, PayloadAction} from '@reduxjs/toolkit';
type Test = {
  name: string;
};
const initialState: Test = {
  name: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

const {actions, reducer} = userSlice;

export const {changeName} = actions;

export default reducer;
