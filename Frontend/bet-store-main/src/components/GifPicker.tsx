
import React, {useCallback, useEffect, useRef, useState } from "react";
import {GiphyFetch} from "@giphy/js-fetch-api";
import { renderGrid } from '@giphy/js-components';
import {removeAllChild} from './Utils';
import { IGif } from "@giphy/js-types";
import { Gif, Grid, Carousel } from "@giphy/react-components";
import { fromPxToOffset, toDomNode } from "./Utils";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { ChatViewControl } from "../reducers/chatBoxReducer";

export const gifWidthDisplay = 400;

const giphyApiKey = "0L5XCnJwI21DzramGOLEE5sZiUDihjVe";
export const giphyFetch = new GiphyFetch(giphyApiKey);

const _GifPicker: React.FC<{onGifChoosen: (gif: any, e : any) => void}> = (param) => {
  const [searchString, setSearchString] = useState<string>("");
  const gifControlState = useSelector((state: {gifControl: {isClearGif: boolean}}) => state.gifControl);

  const gridRef = useRef<HTMLDivElement>();

  const fetchGifTrending = (_offset: number) => {
    return giphyFetch.trending({offset: _offset, limit: 9});
  }

  const fetchGifOnSearch = (_offset: number) => {
    return giphyFetch.search(searchString, {offset: _offset, limit: 9});
  }

  const refreshGrid = () => {
    removeAllChild(gridRef.current);

    let node = document.createElement("div");
    
    if (searchString.length <= 0) {
      renderGrid(
        {width: gifWidthDisplay, gutter: 3, columns: 2, fetchGifs: fetchGifTrending, 
          onGifClick: param.onGifChoosen},
        node);
    } else {
      renderGrid(
        {width: gifWidthDisplay, gutter: 3, columns: 2, fetchGifs: fetchGifOnSearch, 
          onGifClick: param.onGifChoosen},
        node);
    }
    gridRef.current.appendChild(node);
  }

  useEffect(() => {
    refreshGrid();
  }, [searchString]);

  useEffect(() => {
    refreshGrid();
  }, [gifControlState])

  return ( 
    <div style={{backgroundColor:"whitesmoke", height:"450px", maxHeight:"450px", padding:"10px", width:"435px"}}>
      <div style={{height:"10%", alignItems:"center", paddingBottom:"10px"}}>
        <textarea style={{resize:"none", outline:"none", border:"0.5px solid black", width:"90%", wordWrap:"break-word",}} 
          placeholder="Search Gif" rows={1} maxLength={35}
          onInput={
            (e : React.FormEvent<HTMLTextAreaElement>) => {
              setSearchString((e.target as HTMLTextAreaElement).value);
            }
        }></textarea>
      </div>
      <div style={{overflowY:"scroll", height:"90%"}} ref={gridRef}>
        
      </div>
    </div>
  )
};

export const GifPicker = _GifPicker;
