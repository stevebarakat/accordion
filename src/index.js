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
  const {index, state, setState} = useContext(AccordionContext);
  const isActive = index === state.activeIndex;

  return (
    <div
      data-panel-title
      className={isActive ? 'expanded' : ''}
      onClick={() => {
        setState({
          ...state,
          activeIndex: index,
        });
      }}
    >
      {children}
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
            value={{index, state, setState}}
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
