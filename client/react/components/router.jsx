import React from 'react';
import {mount} from 'react-mounter';

import {MainLayout, Welcome} from './layout.jsx';

import SearchPage from './searchPage.jsx';

const exposed = FlowRouter.group({});

var testSection = exposed.group({
    prefix: "/test"
});

/*testSection.route('/', {
    name: "testSearchPage",
    action: function(params, queryParams) {
        mount(MainLayout, {
            content: (<di><SearchPage/></di>)
        })
    }
});*/

testSection.route('/', {
    name: "testSearchPage",
    reactComponent: function() { return SearchPage; },
    action: function(params, queryParams) {
        BlazeLayout.render('layoutFlowRouter', { })
    }
});