import React from 'react'
import $ from 'jquery'
import "../styles/SliderView.scss"
import Axios from 'axios';
import { DataSlider } from '../types/SliderType';


const SliderView: React.FC = () => {

    var [linkdata, setlinkdata] = React.useState<DataSlider[]>([]);

    React.useEffect(
        () => {
            Axios.get(
                "/go/slider/"
            ).then(
                res => {
                    if (res.data["status"] == 200) {
                        setlinkdata(res.data["data"]);
                    } else {
                        console.log(res.data)
                    }
                    console.log(res.data["data"]);
                }
            ).catch(
                err => {
                    console.error(err);
                }
            );
        }
        , []);

    return (
        <div>
            { linkdata?.length > 0 && <div className="SliderViewContainer">
                <div id="carouselsliceview" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators">
                        {
                            linkdata.map(
                                (item: DataSlider, index) => {
                                    return (
                                        <li data-target="#carouselsliceview" data-slide-to={index} />
                                    );
                                }
                            )
                        }

                        {/* <li data-target="#carouselsliceview" data-slide-to={0} className="active" />
                    <li data-target="#carouselsliceview" data-slide-to={1} />
                    <li data-target="#carouselsliceview" data-slide-to={2} /> */}
                    </ol>
                    <div className="carousel-inner">
                        {
                            linkdata.map(
                                (item: DataSlider, index) => {
                                    return (
                                        <div className={"carousel-item " + (index === 0 ? "active" : "")} >
                                            <img className="d-block w-100" src={"/cdn/cdn/" + item.link + "?height=370"} alt={item.alt} />
                                        </div>
                                    );
                                }
                            )
                        }

                        {/* <div className="carousel-item active" >
                        <img className="d-block w-100" src="http://dummyimage.com/960x370.jpg/5fa2dd/ffffff" alt="First slide" />
                    </div>
                    <div className="carousel-item" >
                        <img className="d-block w-100" src="http://dummyimage.com/960x370.jpg/5fa2dd/ffffff" alt="Second slide" />
                    </div>
                    <div className="carousel-item" >
                        <img className="d-block w-100" src="http://dummyimage.com/960x370.jpg/5fa2dd/ffffff" alt="Third slide" />
                    </div> */}
                    </div>
                    <a className="btn-control carousel-control-prev" href="#carouselsliceview" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="btn-control carousel-control-next" href="#carouselsliceview" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="sr-only">Next</span>
                    </a>
                </div>

            </div>}
        </div>
    );
}

export default SliderView