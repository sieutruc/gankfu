import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

require("../../css/style.css");

export const MainLayout = ({content}) => (
    <div id="wrap">
        <Blaze template="header" />

        <div class="page-main">
            {content}
        </div>

        <div class="notifications top-right"></div>
        <div class="notifications center"></div>
        <Blaze template="footer" />
    </div>
);

// define and export our Welcome component
export const Welcome = ({name}) => (
    <div>
        Hello, {name}.
    </div>
);

export const SearchPage = () => (
    <div>
        Hello, truc.
    </div>
);