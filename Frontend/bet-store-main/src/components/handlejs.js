import { element } from "prop-types";
import { Toast } from "react-bootstrap";

export const toastDispose = (element) => {
    element.toast('dispose');
}