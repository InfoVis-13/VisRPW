import { createContext, useContext, useState, useMemo } from "react";

export const DataContext = createContext();

function DataProvider(props) {
  const [selectedAP, setSelectedAP] = useState(-1);
  const [timethreshold, setTimeShow] = useState([-1,999999]);
  const selectedAPHandler = useMemo(() => ({selectedAP, setSelectedAP}), [selectedAP, setSelectedAP]);
  const timethresholdHandler = useMemo(() => ({timethreshold, setTimeShow}), [timethreshold, setTimeShow]);
  console.log("hello");
  return (
    <DataContext.Provider 
      value={useMemo(() => ({selectedAPHandler, timethresholdHandler}), [selectedAPHandler, timethresholdHandler])}
    >
      {props.children}
    </DataContext.Provider>
  );
}

export default DataProvider;

export function useSelectedAP(){
  const value = useContext(DataContext);
  if(value === undefined){
    throw new Error("useSelectedAP must be used within a DataContextProvider")
  }
  return value.selectedAPHandler;
}

export function useTimeThreshold(){
  const value = useContext(DataContext);
  console.log(value);
  if(value === undefined){
    throw new Error("useTimeThreshold must be used within a DataContextProvider")
  }
  return value.timethresholdHandler;
}