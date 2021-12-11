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

const AccordionContext = createContext();
const tasksCollectionRef = collection(db, 'tasks');

function Accordion({children}) {
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

function AccordionItem({children}) {
  return <div data-section>{children}</div>;
}

function AccordionButton({children}) {
  const {index, state, setState, task} = useContext(AccordionContext);
  const isActive = index === state.activeIndex;

  const updateTask = async (id, isCompleted) => {
    const taskDoc = doc(db, 'tasks', id);
    const toggleCompleted = {isCompleted: !isCompleted};
    await updateDoc(taskDoc, toggleCompleted);
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

function AccordionPanel({children}) {
  const {index, state} = useContext(AccordionContext);
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
      <Accordion>
        {state.tasks.map((task, index) => (
          <AccordionContext.Provider
            key={index}
            value={{index, state, setState, task}}
          >
            <AccordionItem>
              <AccordionButton>{task.text}</AccordionButton>
              <AccordionPanel>Control Panel</AccordionPanel>
            </AccordionItem>
          </AccordionContext.Provider>
        ))}
      </Accordion>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
