import { createContext, useContext, useState, useMemo, useRef } from "react";
import * as d3 from "d3";

export const DataContext = createContext();

function DataProvider(props) {
  const [selectedAP, setSelectedAP] = useState(-1);
  const [timeThreshold, setTimeThreshold] = useState([-1,999999]);
  const [time, setTime] = useState(0);
  const [graphNumber, setGraphNumber] = useState(1);
  const [brushed, setBrushed] = useState(true);

  const selectedAPHandler = useMemo(() => ({selectedAP, setSelectedAP}), [selectedAP, setSelectedAP]);
  const timeThresholdHandler = useMemo(() => ({timeThreshold, setTimeThreshold}), [timeThreshold, setTimeThreshold]);
  const timeHandler = useMemo(() => ({time, setTime}), [time, setTime]);
  const graphNumberHandler = useMemo(() => ({graphNumber, setGraphNumber}), [graphNumber, setGraphNumber]);
  const brushedHandler = useMemo(() => ({brushed, setBrushed}), [brushed, setBrushed]);
  return (
    <DataContext.Provider 
      value={useMemo(() => ({selectedAPHandler, timeThresholdHandler, timeHandler, graphNumberHandler, brushedHandler})
      ,[selectedAPHandler, timeThresholdHandler, graphNumberHandler, brushedHandler])}
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
  if(value === undefined){
    throw new Error("useTimeThreshold must be used within a DataContextProvider")
  }
  return value.timeThresholdHandler;
}

export function useTime(){
  const value = useContext(DataContext);
  if(value === undefined){
    throw new Error("useTime must be used within a DataContextProvider")
  }
  return value.timeHandler;
}

export function useGraphNumber(){
  const value = useContext(DataContext);
  if(value === undefined){
    throw new Error("useGraphNumber must be used within a DataContextProvider")
  }
  return value.graphNumberHandler;
}

export function useBrushed(){
  const value = useContext(DataContext);
  if(value === undefined){
    throw new Error("useBrushed must be used within a DataContextProvider")
  }
  return value.brushedHandler;
}