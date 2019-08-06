/**
 * Created by hacops on 30/05/2015.

 */

Template.layout.rendered = function (){
    $('body').niceScroll();
};

Template.layoutFlowRouter.helpers({
    hasReactComponent: function() {
        return !_.isUndefined(FlowRouter.current().route.options.reactComponent);
    },
    reactComponent: function() {
        return FlowRouter.current().route.options.reactComponent();
    }
});

