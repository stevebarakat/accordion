import React, {useState, useEffect, createContext, useContext} from 'react';
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
import initialTasks from './initialTasks';

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
  const {index, activeIndex, setActiveIndex, task} = useContext(TasksContext);
  const isActive = index === activeIndex;

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
          setActiveIndex(!isActive ? index : !activeIndex);
        }}
      >
        {isActive ? '-' : '+'}
      </button>
    </div>
  );
}

function ControlPanel({children}) {
  const {index, activeIndex} = useContext(TasksContext);
  const isActive = index === activeIndex;

  return (
    <div data-panel-content className={isActive ? 'expanded' : ''}>
      {children}
    </div>
  );
}
function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTasks = async () => {
      const data = await getDocs(tasksCollectionRef);
      const tasks = await data.docs.map(doc => ({...doc.data(), id: doc.id}));
      setTasks(tasks);
    };
    getTasks();
    setIsLoading(false);
  }, [tasks]);

  return isLoading ? (
    'loading...'
  ) : (
    <div className="App">
      <TaskList>
        <TaskForm />
        {tasks.map((task, index) => (
          <TasksContext.Provider
            key={index}
            value={{index, tasks, setTasks, task, activeIndex, setActiveIndex}}
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
