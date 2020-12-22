import Axios from "axios";
import reactElementToJSXString from "react-element-to-jsx-string";

export function copyToClipboard(text: string) {
  let input = document.body.appendChild(document.createElement("input")) as HTMLInputElement;
  input.value = text;
  input.focus();
  input.select();
  document.execCommand('copy');
  input.parentNode?.removeChild(input);
}

export function toDomNode(x : JSX.Element) {
  return (new DOMParser()).parseFromString(reactElementToJSXString(x), 'text/html').body.firstChild;
}

export function fromPxToOffset(x : String) {
  let index = x.search("px");
  return Number.parseInt(x.slice(0, index), 10);
}

export function getMeta(url: string, callback: Function) {
  let img = new Image();
  img.src = url;
  img.onload = () => {
    callback(img.width, img.height);
  }
}

export const getTextWidth = (text: string, font: string) => {
  let canvas = document.createElement("canvas");
  canvas.style.visibility = "hidden";

  let context = canvas.getContext("2d");
  context.font = font;
  let metrics = context.measureText(text);
  return metrics.width;
};

export const removeAllChild = (parent: HTMLElement) => {
  let size = parent.children.length;
  let childNode = [];
  for (let i = 0; i < size; i++) {
    childNode.push(parent.children[i]);
  }
  for (let i = 0; i < size; i++) {
    parent.removeChild(childNode[i]);
  }
}