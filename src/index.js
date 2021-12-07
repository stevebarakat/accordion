import React, {useState, createContext, useContext} from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import initalState from './initialState';

const AccordionContext = createContext();

function Accordion({children}) {
  return (
    <div data-accordion>
      {children.map((child, index) => {
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

  return (
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
