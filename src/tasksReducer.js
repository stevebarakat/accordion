export default function tasksReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_IS_COMPLETED':
      const toggledTasks = state.tasks.map(task =>
        task.id === action.payload.id
          ? {...action.payload, complete: !action.payload.complete}
          : task,
      );
      return {
        ...state,
        tasks: toggledTasks,
      };
    default:
      return state;
  }
}
