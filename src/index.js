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
import initalState from './initialState';

const AccordionContext = createContext();
const tasksCollectionRef = collection(db, 'tasks');

function Accordion({children}) {
  return (
    <div data-accordion>
      {/* {children.map((child, index) => {
        return <div key={`section-${index}`}>{child}</div>;
      })} */}
    </div>
  );
}

function AccordionItem({children}) {
  return <div data-section>{children}</div>;
}

function AccordionButton({children}) {
  const {index, state, setState, task} = useContext(AccordionContext);
  const isActive = index === state.activeIndex;
  console.log(task);

  function toggleCompleted(e) {
    const toggledTasks = state.tasks.map(task =>
      task.id === e.target.id
        ? {...task, isCompleted: !task.isCompleted}
        : task,
    );
    setState({
      ...state,
      tasks: toggledTasks,
    });
  }

  return (
    <div data-panel-title className={isActive ? 'expanded' : ''}>
      <input
        type="checkbox"
        id={task.id}
        onChange={e => toggleCompleted(e)}
        checked={task.isCompleted}
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

  useEffect(() => {
    const getTasks = async () => {
      const data = await getDocs(tasksCollectionRef);
      setState(data.docs.map(doc => ({...doc.data(), id: doc.id})));
    };
    getTasks();
    setIsLoading(false);
  }, []);

  return isLoading ? (
    'loading...'
  ) : (
    <div className="App">
      <Accordion>
        {(async function () {
          const name = await state[0].name;
          console.log(name);
          return name;
        })()}

        {state.tasks?.map((task, index) => (
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
