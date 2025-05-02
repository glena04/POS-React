import React from 'react';

import '../CSS/Info.css';

const Info = () => {
    return (
        <div className="info-container">
            <div className="info-content">
                <h2>About the POS System</h2>
                <p>
                    Welcome to the POS System! This application is designed to help you manage your products, sales, and inventory efficiently.
                </p>
                <p>
                    Features include:
                </p>
                <ul>
                    <li>Product management</li>
                    <li>Real-time inventory updates</li>
                    <li>Secure user authentication</li>
                    <li>Detailed sales reports</li>
                </ul>
                <p>
                    For more information, please contact our support team or visit our website.
                    <p> Tel: +491726143430,</p>
                    <p> Email: info@glesta.net,</p>
                    <p> Website: <a href="https://www.glesta.net" target="_blank" rel="noopener noreferrer">www.glesta.net</a></p>


                    <p> Address: Kopernikusstr. 63, Düsseldorf, Germany</p>
                       
                </p>
            </div>
        </div>
    );
};

export default Info;
