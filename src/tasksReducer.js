export default function tasksReducer(state, action) {
  switch (action.type) {
    case 'ubu':
      console.log('reducer: ', action.payload);
      break;
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}
