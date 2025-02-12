import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function PopupComponent({buttonLabel, popupInfo}) {
    return (
        <div>
            <Popup trigger=
                {<button class="login-btn">{buttonLabel}</button>}
                position="top center">
                <div>
                    <h5>{popupInfo}</h5>
                </div>
                {/* <button type="button" className="login-btn">Confirm</button> */}
            </Popup>
        </div>
    )
};