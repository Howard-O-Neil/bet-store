import React from "react";
import { useEffect } from "react";
import { NotifyType } from "../types/notifyType";

function makeid(length:number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

const ToastNotify: React.FC<{ notify: NotifyType, handleErase:any }> = (notify, handleErase) => {
    let ref = React.createRef<HTMLDivElement>();
    const [IsErase, setIsErase] = React.useState<boolean>(false);
    const toastname = makeid(6);
    let interval = setInterval(
        () => {
            //if (ref.current === null) return
            // console.log("hahaha");
            // toastDispose($("#"+toastname));
            setIsErase(true);
            //console.log(handleErase);
            //handleErase();
            clearInterval(interval);
            //setInterval(null);
        }, 3000);
    useEffect(() => {

        //console.log("ref");
    }, [IsErase])


    return (
        <div>            
            { !IsErase && <div ref={ref} className={"toast fade show "} id = {toastname} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <svg className="bd-placeholder-img rounded mr-2" width={20} height={20} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img"><rect width="100%" height="100%" fill="#007aff" /></svg>
                    <strong className="mr-auto">{notify.notify.title}</strong>
                    <small className="text-muted">just now</small>
                    <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="toast-body">
                    {notify.notify.destination}
                </div>
            </div>}
        </div>
    );
}



export default ToastNotify;