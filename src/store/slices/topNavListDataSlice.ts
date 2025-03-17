import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ITopNavItem {
    id: string;
    title: string;

}

export interface ITopNavListState {
    items: ITopNavItem[];
}

const initialState: ITopNavListState = {
    items: [],
};

const topNavListSlice = createSlice({
    name: 'topNavList',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<ITopNavItem[]>) => {
            state.items = action.payload;
        }
    },
});

export const { setItems } = topNavListSlice.actions;

export default topNavListSlice.reducer;