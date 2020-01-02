import React, { useState, createContext, useContext, Children } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const TabsContext = createContext();

function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div data-tabs>{children}</div>
    </TabsContext.Provider>
  );
}

const TabListContext = createContext();

function TabList({ children }) {
  return (
    <div data-tab-list>
      {Children.map(children, (child, index) => (
        <TabListContext.Provider value={{ index }}>
          {child}
        </TabListContext.Provider>
      ))}
    </div>
  );
}

function Tab({ children, disabled }) {
  const { index } = useContext(TabListContext);
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  const isActive = index === activeIndex;
  return (
    <div
      data-tab
      className={disabled ? "disabled" : isActive ? "active" : ""}
      onClick={disabled ? undefined : () => setActiveIndex(index)}
    >
      {children}
    </div>
  );
}

function TabPanels({ children }) {
  const { activeIndex } = useContext(TabsContext);
  return <div data-tab-panels>{Children.toArray(children)[activeIndex]}</div>;
}

function TabPanel({ children }) {
  return <div data-tab-panel>{children}</div>;
}

function DataTabs({ data, tabsPosition = "top", disabled = [] }) {
  const tabs = (
    <TabList>
      {data.map((item, index) => (
        <Tab key={index} disabled={disabled.includes(index)}>
          {item.label}
        </Tab>
      ))}
    </TabList>
  );
  const panels = (
    <TabPanels>
      {data.map((item, index) => (
        <TabPanel key={index}>{item.content}</TabPanel>
      ))}
    </TabPanels>
  );
  return (
    <Tabs>{tabsPosition === "bottom" ? [panels, tabs] : [tabs, panels]}</Tabs>
  );
}

function App() {
  const tabData = [
    {
      label: "Login",
      content: "Login"
    },
    {
      label: "Signup",
      content: "Signup"
    }
  ];
  return (
    <>
      <Tabs>
        <TabList>
          <Tab>Login</Tab>
          <Tab disabled>Signup</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Login</TabPanel>
          <TabPanel>Signup</TabPanel>
        </TabPanels>
      </Tabs>
      <DataTabs data={tabData} tabsPosition="bottom" disabled={[1]} />
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
