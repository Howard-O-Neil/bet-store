import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AddNotify } from '../actions/notifyAction';
import { AddSlider, GetSlider, RemoveSlider,EditSlider as EditSliderAction } from '../actions/sliderAction';
import { AppState } from '../store';
import styles from '../styles/slider.module.scss'
import { DataSlider } from '../types/SliderType';
import { EditSlider } from './EditSlider';

export const SliderManager = () => {
	const dispatch = useDispatch();
	const getSlider = useSelector((state: AppState) => state.getSlider)
	const [sliderLocal, setsliderLocal] = useState<DataSlider[]>([]);
	const [IsLoading, setIsLoading] = useState(true);
	const [Submitting, setSubmitting] = useState(false);
	const [ModeEditer, setModeEditer] = useState<{ state: boolean, index: number }>({ state: false, index: 0 })
	const [ModeAddSlider, setModeAddSlider] = useState(false)
	const [SubmitAddLoading, setSubmitAddLoadding] = useState(false)
	const addSlider = useSelector((state: AppState) => state.addSlider)
	const removeSlider = useSelector((state: AppState) => state.removeSlider)
	const [removingSlider, setremovingSlider] = useState<{ state: boolean, index: number }>({ state: false, index: 0 })
	const editSlider = useSelector((state:AppState) => state.editSlider)
	useEffect(() => {
		dispatch(GetSlider());
	}, [dispatch])

	useEffect(() => {
		if (getSlider.IsFetching === false) {
			getSlider.Payload && setsliderLocal(getSlider.Payload);
			setIsLoading(false);
		}
	}, [dispatch, getSlider, getSlider.IsFetching])

	const onChangeInfoImage = (index: number, type: string, payload: string) => {
		if (ModeAddSlider && index !== sliderLocal.length - 1) {
			dispatch(AddNotify({ path: "", destination: "Bạn cân lưu lại slider mới trước khi chỉnh sửa", title: "BetStore" }));
			return;
		} else if (ModeAddSlider) {
			setModeEditer({ ...ModeEditer, state: false });
		} else {
			setModeEditer({ ...ModeEditer, state: true, index: index });
		}
		let obj = sliderLocal[index];
		console.log(type)
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
		setSubmitting(true)
		dispatch(EditSliderAction(sliderLocal[ModeEditer.index]));
	}

	useEffect(() => {
		if(editSlider.IsFetching===false&&ModeEditer.state===true&&Submitting === true)
		{
			setSubmitting(false)
			//setsliderLocal([...sliderLocal.slice(0, ModeEditer.index),editSlider.Payload, ...sliderLocal.slice(ModeEditer.index + 1)])
			setModeEditer({...ModeEditer,state:false, index:-1})
			dispatch(AddNotify({ path: "", destination: "Sửa slider thành công", title: "BetStore" }));
		}
	}, [ModeEditer, dispatch, editSlider.IsFetching, editSlider?.Payload, sliderLocal])

	const ResetSlice = () => {
		setsliderLocal(getSlider.Payload);
	}

	const HandleAddSlice = () => {
		setModeAddSlider(true);
		ResetSlice();
		setModeEditer({ ...ModeEditer, state: false });
		setsliderLocal([...sliderLocal, { link: "", alt: "", href: "", _id: "" }])
	}

	const HandleSubmitAdd = () => {
		setSubmitAddLoadding(true)
		dispatch(AddSlider(sliderLocal[sliderLocal.length - 1]));
	}

	const HandleErase = (index: number) => {
		// eslint-disable-next-line no-restricted-globals
		let result = confirm("Bạn có muốn xóa slider này không?");
		if (result === false) {
			return
		}
		let obj = sliderLocal[index]

		dispatch(RemoveSlider(obj._id))
		setremovingSlider({ index: index, state: true })
		//setsliderLocal([...sliderLocal.slice(0, index), ...sliderLocal.slice(index + 1)])
	}

	useEffect(() => {
		if (removeSlider.IsFetching === false && removingSlider.state) {
			setremovingSlider({ ...removingSlider, state: false })
			//console.log()
			setsliderLocal([...sliderLocal.slice(0, removingSlider.index), ...sliderLocal.slice(removingSlider.index + 1)])

			dispatch(AddNotify({ path: "", destination: "Xóa slider thành công", title: "BetStore" }));
		}
	}, [dispatch, removeSlider.IsFetching, removingSlider, sliderLocal])


	useEffect(() => {
		if (addSlider.IsFetching === false && SubmitAddLoading === true) {
			//debugger;
			setModeAddSlider(false);
			dispatch(AddNotify({ path: "", destination: "Add slider thành công", title: "BetStore" }));
			//console.log(addSlider.Payload)
		}
	}, [dispatch, addSlider, SubmitAddLoading, sliderLocal])
	const sliderLocals = sliderLocal;
	return (
		<div className={styles.Container}>
			<div className={styles.Title}>
				<h4>Quản lý slider</h4>
				{ModeEditer.state && <div>
					<h5>Chế độ chỉnh sửa</h5>
				</div>}

			</div>
			<div className={styles.BodyList}>
				{
					!IsLoading
						? sliderLocals?.map(
							(item, index) => {
								return (
									<div>
										{!ModeEditer.state&&<div className={styles.BtnErase} onClick={() => HandleErase(index)}>
											<i className="fas fa-times-circle"></i>
										</div>}
										<EditSlider mode={ModeEditer} dataSlider={item} onChange={onChangeInfoImage} indexSlider={index} />
										{ index === sliderLocals.length - 1 && ModeAddSlider && <input className={styles.BTNSaveAdd} type="button" value="Lưu lại" onClick={HandleSubmitAdd} />}
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
			{ModeEditer.state && <div className={styles.BtnControl}>
				<input type="button" value="Lưu" onClick={HandleSubmit} />
			</div>}
		</div>
	);
} 