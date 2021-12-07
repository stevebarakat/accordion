import React, {useState, createContext, useContext} from 'react';
import ReactDOM from 'react-dom';
import './style.css';

const data = [
  {
    label: 'Item One',
    content: <Description content="itemOne" />,
  },
  {
    label: 'Item Two',
    content: <Description content="itemTwo" />,
  },
  {
    label: 'Item Three',
    content: <Description content="itemThree" />,
  },
];

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
  const {index, activeIndex, setActiveIndex} = useContext(AccordionContext);
  const isActive = index === activeIndex;

  return (
    <div
      data-panel-title
      className={isActive ? 'expanded' : ''}
      onClick={() => {
        setActiveIndex(index);
      }}
    >
      {children}
    </div>
  );
}

function AccordionPanel({children}) {
  const {index, activeIndex} = useContext(AccordionContext);
  const isActive = index === activeIndex;

  return (
    <div data-panel-content className={isActive ? 'expanded' : ''}>
      {children}
    </div>
  );
}

function Description({content}) {
  const data = {
    itemOne: "Item one's content.",
    itemTwo: "Item two's content.",
    itemThree: "Item three's content.",
  };

  return <div>{data[content]}</div>;
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="App">
      <Accordion>
        {data.map((item, index) => (
          <AccordionContext.Provider
            key={index}
            value={{index, activeIndex, setActiveIndex}}
          >
            <AccordionItem>
              <AccordionButton>{item.label}</AccordionButton>
              <AccordionPanel>{item.content}</AccordionPanel>
            </AccordionItem>
          </AccordionContext.Provider>
        ))}
      </Accordion>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
