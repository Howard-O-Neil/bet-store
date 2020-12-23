import React from 'react'
import "../../styles/Footer.scss"

const FooterView:React.FC=()=>{
    return(
        <div className="FooterViewContainer">
            <div className = "container">
                <div className = "child-container content">
                    <div className = "about">
                        <div className = "title">
                            <h4>About</h4>
                        </div>
                        <div className = "content-about">
                            <p>There are a number of reasons you may need a block of text and when you do, a random paragraph can be the perfect solution.</p>
                        </div>
                    </div>
                    <div className = "contact">
                        <div className = "title">
                            <h4>Contact</h4>
                        </div>
                        <div className="social-icon">
                            <a href="#">
                                <i className="fab fa-facebook-square"></i>
                            </a>

                            <a href="#">
                                <i className="fab fa-twitter-square"></i> 
                            </a>

                            <a href="#">
                                <i className="fab fa-github-square"></i>
                            </a>
                        </div>
                    </div>
                    <div className = "donate">
                        <div className = "title">
                            <h4>Donate</h4>
                        </div>
                        <img src = "/static/media/qr.jpg" alt = "qr-donate"/>                    </div>
                </div>

                <nav className = "nav-footer">

                </nav>
                <div className = "writer">
                    <h6>@ This website is created by KTM</h6>
                </div>
            </div>
        </div>
    );
}

export default FooterView