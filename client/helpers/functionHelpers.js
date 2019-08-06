// this file defined all the functions used in the js files

getAgeDob = function(date){

    var age = moment(date, 'DD-MM-YYYY');
    var now = moment();
    return now.diff(age, 'years');
};
getAge = function(date){
    var age = moment.unix(date);
    var now = moment();
    return now.diff(age, 'years');
};
getUserLanguage = function () {
  // Put here the logic for determining the user language
  return "en";
};

getCurrentRouteName = function() {
    return Router.current().route.getName();
};