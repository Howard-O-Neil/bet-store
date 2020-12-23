import React, { createRef } from "react";
import { NotifyType } from "../types/notifyType";
import ToastNotify from "./ToastsNotify";
import styles from "../styles/notify.module.scss"
import { useEffect } from "react";
import { useState } from "react";
import $ from 'jquery'
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle"
import { toastDispose } from "./handlejs";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../store";
import { DelNotify } from "../actions/notifyAction";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";


const SetNotify = (state: NotifyType[], notiNew: NotifyType) => {
    return [
        ...state,
        notiNew
    ]
}

const PopNotify = (state: NotifyType[]) => {
    let newState = state.slice(0, state.length - 1);// {...state};
    //newState.pop();
    return newState;
}
const NotifyContainer: React.FC = () => {
    const [notiqueue, setnotiqueue] = useState<NotifyType[]>([]);
    const notify = useSelector((state: AppState) => state.notify);
    const dispatch = useDispatch();
    const HandleErase:Function = ()=>{
        if (notifycontainer.current.childElementCount===0) return;
        notifycontainer.current.children[0].remove();        
    }
    var isDelAutoNoti = false;

    let notifycontainer = createRef<HTMLDivElement>();
    useEffect(() => {
        if (notify.Payload.notifies.length === 0) return;
        var notiPop = notify.Payload.notifies[notify.Payload.notifies.length - 1];

        setnotiqueue(SetNotify(notiqueue,notiPop));
        //debugger;
        //const element = React.createElement(ToastNotify, { notify: notiPop, handleErase: HandleErase });
        //let elementString = ReactDOMServer.renderToString(element);
        //let ele = document.createElement("div");
        //ele.innerHTML = elementString;
        //notifycontainer.current.appendChild(ele);
        dispatch(DelNotify());
    }, [dispatch, notify.Payload, notiqueue]);
    useEffect(() => {
        setInterval(
            () => {
                if (isDelAutoNoti === true) {
                    clearInterval();
                    return;
                }
                isDelAutoNoti = true;
                if (notiqueue.length === 0) {
                    clearInterval();
                    isDelAutoNoti = false;
                    return;
                }
                setnotiqueue(PopNotify(notiqueue));
            }, 3000
        );
    }, [notiqueue, setnotiqueue, isDelAutoNoti]);

    return (
        <div>
            <div aria-live="polite" aria-atomic="true" className={styles.NotifyContainer}>
                <div ref={notifycontainer}>
                    {
                        notiqueue.map(
                            (item: NotifyType) => {
                                return <ToastNotify notify={item} handleErase />
                            }
                        )
                    }

                </div>
            </div>
        </div>
    );
}

export default NotifyContainer;