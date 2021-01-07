import React, { createRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { UploadImage } from '../actions/imageActionsts';
import { AppState } from '../store';
import styles from '../styles/EditSlider.module.scss'
import { DataSlider } from '../types/SliderType';


type ChildProps = {
    dataSlider: DataSlider,
    onChange: Function,
    indexSlider: number,
    mode:{ state: boolean, index: number }
}

export const EditSlider: React.FC<ChildProps> = ({ mode,dataSlider, onChange, indexSlider }) => {
    const InputImage = createRef<HTMLInputElement>();
    const Image = createRef<HTMLImageElement>();
    const container = createRef<HTMLDivElement>();
    const [classImg, setclassImg] = useState("");
    const dispatch = useDispatch();
    const uploadImages = useSelector((state: AppState) => state.uploadImage)
    const [IsUploading, setIsUploading] = useState(false)

    useEffect(() => {
        if(mode.state===true && mode.index !== indexSlider){
            container.current.style.opacity = '0.5'
        } else {
            container.current.style.opacity = '1'
        }
    }, [container, indexSlider, mode])

    const HandleChangeImage = (evt: React.ChangeEvent<HTMLInputElement>): any => {
        var file = evt.target.files[0];
        setIsUploading(true)
        dispatch(UploadImage(file));
    }
    //console.log(dataSlider)

    useEffect(() => {
        if (IsUploading === false) return;
        if (uploadImages.IsFetching === false) {
            if (uploadImages.Error === "" && uploadImages.Payload !== "") {
                onChange(indexSlider, "LINK_IMAGE", uploadImages.Payload)
                setIsUploading(false)
            }
        }
    }, [IsUploading, dispatch, indexSlider, onChange, uploadImages])

    return (
        <div className={styles.Container} ref = {container} >
            <div className={styles.ImgContainer} onClick={() =>((mode.state===false)||(mode.state===true && mode.index === indexSlider))&& InputImage.current.click()}>
                <input ref={InputImage} type="file" onChange={HandleChangeImage}></input>
                
                <img alt={dataSlider.alt} src={`/cdn/cdn/${dataSlider.link}`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/static/media/notfound.png" }}></img>
            </div>
            <div className={styles.Content}>
                <div>
                    <input className={styles.Title} type="text" value={dataSlider.alt} onChange={(evt) => ((mode.state===false)||(mode.state===true && mode.index === indexSlider))&&onChange(indexSlider, "ATL_IMAGE", evt.target.value)} placeholder="Alt image..." />
                    <input className={styles.Path} type="text" value={dataSlider.href} onChange={(evt) => ((mode.state===false)||(mode.state===true && mode.index === indexSlider))&&onChange(indexSlider, "PATH_IMAGE", evt.target.value)} placeholder="Path image..." />
                </div>
                <p>Ấn vào để chỉnh sửa</p>
            </div>
        </div>
    );
} 