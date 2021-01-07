import React, { useEffect, useState } from 'react'
import Switch from 'react-bootstrap/esm/Switch';
import { Link, Redirect, Route, RouteComponentProps, useHistory } from 'react-router-dom'
import { SliderManager } from '../components/SliderManager';
import styles from '../styles/Admin.module.scss'
import { Page404Screen } from './404Screen';
import CategoryListScreen from './CategoryListScreen';

type TParams = { tabname: string };

const SLIDER_TAB = 'slider'
const CATEGORY_TAB = 'category'

export const AdminScreen = ({ match }: RouteComponentProps<TParams>) => {
	const history = useHistory();

	const [TabSelected, setTabSelected] = useState(SLIDER_TAB);
	return (
		<div style={{background:'#f1f1f1', paddingTop: '20px',paddingBottom: '20px'}}>
			<div className={["container", styles.Container].join(' ')}>

			<div className={styles.TabLeft} >
				<label>
					<input type = "radio" name = "TabSelection" value = {SLIDER_TAB} defaultChecked = {match.params.tabname === SLIDER_TAB||history.location.pathname.includes(match.params.tabname)} onChange = {evt =>history.push(evt.target.value)}/>
					<span>Slider</span>
				</label>
				<label>
					<input type = "radio" name = "TabSelection" value = {CATEGORY_TAB} defaultChecked = {match.params.tabname === CATEGORY_TAB} onChange = {evt =>history.push(evt.target.value)}/>
					<span>Category</span>
				</label>
			</div>

			<div className={styles.Body} >
					<Route path={`/admin/slider`} component={SliderManager} />
					<Route path={`/admin/category`} component={CategoryListScreen} />
					<Route path={`/admin/*`}>
						<Redirect to="/admin/slider" />
					</Route>
			</div>
			</div>
		</div>
	)
}

const MinhView = ()=>{
	return <p>hahahahah</p>
}