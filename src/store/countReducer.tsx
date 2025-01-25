// import { createSlice } from "@reduxjs/toolkit";

// interface countState {
//   count: number;
// }

// const initialState: countState = {
//   count: Number(localStorage.getItem("count")) || 0,
// };

// const CountSlice = createSlice({
//   name: "count",
//   initialState,
//   reducers: {
//     setCount: (state) => {
//       state.count = state.count + 1;
//       localStorage.setItem("count", state.count.toString());
//     },
//     clearCount: (state) => {
//       state.count = 0;
//       localStorage.setItem("count", "0");
//     },
//   },
// });

// export const { setCount, clearCount } = CountSlice.actions;
// export default CountSlice.reducer;
