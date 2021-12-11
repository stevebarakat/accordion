import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import ReactDOM from 'react-dom';
import {db} from './firebase-config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import './style.css';
import initalState from './initialState';

const TasksContext = createContext();
const tasksCollectionRef = collection(db, 'tasks');

function TaskForm({children}) {
  const [taskItemText, setTaskItemText] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    await addDoc(tasksCollectionRef, {
      text: taskItemText,
      isCompleted: false,
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        name="task"
        value={taskItemText}
        className="task-input"
        onChange={e => setTaskItemText(e.target.value)}
      />
      <button type="submit" className="task-form-btn">
        +
      </button>
    </form>
  );
}

function TaskList({children}) {
  console.log('children: ', children);
  return (
    <div data-accordion>
      {children.map((child, index) => {
        console.log(child);
        return <div key={`section-${index}`}>{child}</div>;
      })}
    </div>
  );
}

function TaskWrap({children}) {
  return <div data-section>{children}</div>;
}

function TaskItem({children}) {
  const {index, state, setState, task} = useContext(TasksContext);
  const isActive = index === state.activeIndex;

  const updateTask = async (id, isCompleted) => {
    const taskDoc = doc(db, 'tasks', id);
    const toggleCompleted = {isCompleted: !isCompleted};
    await updateDoc(taskDoc, toggleCompleted);
  };

  const deleteTask = async id => {
    const taskDoc = doc(db, 'tasks', id);
    await deleteDoc(taskDoc);
  };

  return (
    <div data-panel-title className={isActive ? 'expanded' : ''}>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => updateTask(task.id, task.isCompleted)}
      />
      <span
        style={
          task.isCompleted
            ? {textDecoration: 'line-through'}
            : {textDecoration: 'none'}
        }
      >
        {children}
      </span>
      <button
        onClick={() => {
          deleteTask(task.id);
        }}
      >
        x
      </button>
      <button
        style={{display: 'none'}}
        onClick={() => {
          setState({
            ...state,
            activeIndex: !isActive ? index : !state.activeIndex,
          });
        }}
      >
        {isActive ? '-' : '+'}
      </button>
    </div>
  );
}

function ControlPanel({children}) {
  const {index, state} = useContext(TasksContext);
  const isActive = index === state.activeIndex;

  return (
    <div data-panel-content className={isActive ? 'expanded' : ''}>
      {children}
    </div>
  );
}
function App() {
  const [state, setState] = useState(initalState);
  const [isLoading, setIsLoading] = useState(true);

  const memoizedCallback = useCallback(async () => {
    const data = await getDocs(tasksCollectionRef);
    const tasks = await data.docs.map(doc => ({...doc.data(), id: doc.id}));
    setState({...state, tasks});
  }, [state]);

  useEffect(() => {
    const getTasks = async () => {
      memoizedCallback();
    };
    getTasks();
    setIsLoading(false);
  }, []);

  console.log(state);

  return isLoading ? (
    'loading...'
  ) : (
    <div className="App">
      <TaskList>
        <TaskForm />
        {state.tasks.map((task, index) => (
          <TasksContext.Provider
            key={index}
            value={{index, state, setState, task}}
          >
            <TaskWrap>
              <TaskItem>{task.text}</TaskItem>
              <ControlPanel>Control Panel</ControlPanel>
            </TaskWrap>
          </TasksContext.Provider>
        ))}
      </TaskList>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
