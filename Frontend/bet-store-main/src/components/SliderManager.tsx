import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AddNotify } from '../actions/notifyAction';
import { AddSlider, GetSlider } from '../actions/sliderAction';
import { AppState } from '../store';
import styles from '../styles/slider.module.scss'
import { DataSlider } from '../types/SliderType';
import { EditSlider } from './EditSlider';

export const SliderManager = () => {
	const dispatch = useDispatch();
	const getSlider = useSelector((state: AppState) => state.getSlider)
	const [sliderLocal, setsliderLocal] = useState<DataSlider[]>([]);
	const [IsLoading, setIsLoading] = useState(true);
	const [ModeEditer, setModeEditer] = useState(false)
	const [ModeAddSlider, setModeAddSlider] = useState(false)
	const [SubmitAddLoading, setSubmitAddLoadding] = useState(false)
	const addSlider = useSelector((state:AppState) => state.addSlider)

	useEffect(() => {
		dispatch(GetSlider());
	}, [dispatch])

	useEffect(() => {
		if (getSlider.IsFetching === false) {
			setsliderLocal(getSlider.Payload);
			setIsLoading(false);
		}
	}, [dispatch, getSlider, getSlider.IsFetching])

	const onChangeInfoImage = (index: number, type: string, payload: string) => {
		if (ModeAddSlider && index !== sliderLocal.length-1) {
			dispatch(AddNotify({ path: "", destination: "Bạn cân lưu lại slider mới trước khi chỉnh sửa", title: "BetStore" }));
			return;
		} else if (ModeAddSlider) {
			setModeEditer(false);
		} else {
			setModeEditer(true);
		}
		let obj = sliderLocal[index];
		switch (type) {
			case "ATL_IMAGE":
				obj.alt = payload;
				setsliderLocal([...sliderLocal.slice(0, index), obj, ...sliderLocal.slice(index + 1)])
				break;
			case "PATH_IMAGE":
				obj.href = payload;
				setsliderLocal([...sliderLocal.slice(0, index), obj, ...sliderLocal.slice(index + 1)])
				break;
			case "LINK_IMAGE":
				obj.link = payload;
				setsliderLocal([...sliderLocal.slice(0, index), obj, ...sliderLocal.slice(index + 1)])
				break;
			default:
				break;
		}
	}

	const HandleSubmit = () => {

	}

	const ResetSlice = () => {
		setsliderLocal(getSlider.Payload);
	}

	const HandleAddSlice = () => {
		setModeAddSlider(true);
		ResetSlice();
		setModeEditer(false);
		setsliderLocal([...sliderLocal, { link: "", alt: "", href: "", _id: "" }])
	}

	const HandleSubmitAdd = () => {
		setSubmitAddLoadding(true)
		dispatch(AddSlider(sliderLocal[sliderLocal.length-1]));
	}

	useEffect(() => {
		if(addSlider.IsFetching === false&&SubmitAddLoading === true){
			//debugger;
			//dispatch(AddNotify({ path: "", destination: "Add slider thành công", title: "BetStore" }));
			//setModeAddSlider(false);
			console.log(addSlider.Payload)
		}
	}, [dispatch, addSlider, SubmitAddLoading, sliderLocal])
	return (
		<div className={styles.Container}>
			<div className={styles.Title}>
				<h4>Quản lý slider</h4>
				{ModeEditer && <div>
					<h5>Chế độ chỉnh sửa</h5>
				</div>}

			</div>
			<div className={styles.BodyList}>
				{/* <div className={styles.BtnErase}>
					<i className="fas fa-window-close"></i>
				</div> */}
				{
					!IsLoading
						? sliderLocal.map(
							(item, index) => {
								return (
									<div>
										<EditSlider dataSlider={item} onChange={onChangeInfoImage} indexSlider={index} />
										{ index === sliderLocal.length -1 && ModeAddSlider &&  <input className = {styles.BTNSaveAdd} type="button" value="Lưu lại" onClick={HandleSubmitAdd} />}
									</div>
								);
							}
						)
						: <div className="spinner-border text-danger" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
				}
			</div>
			 { !ModeAddSlider && <input type="button" value="Thêm slice mới" onClick={HandleAddSlice} />}
			{ModeEditer && <div className={styles.BtnControl}>
				<input type="button" value="Lưu" onClick={HandleSubmit} />
			</div>}
		</div>
	);
} 