import React from 'react';

import {
    SearchkitManager, SearchkitProvider,
    SearchBox, RefinementListFilter, MenuFilter,
    Hits, HitsStats, NoHits, Pagination, SortingSelector,
    SelectedFilters, ResetFilters, ItemHistogramList,
    Layout, LayoutBody, LayoutResults, TopBar,
    SideBar, ActionBar, ActionBarRow, SearchkitComponent
} from "searchkit";

const assign = require("lodash/assign")


const searchkit = new SearchkitManager("/elsearch");

const builder = function (query, options:SimpleQueryStringOptions={}){
    console.log("query is ",query);
    if(!query){
        return
    }

    let querytest =  {
        "simple_query_string":assign({query}, options)
    }
    let locationQuery = { "filtered" : {
        "query" : {
            "match_all" : {}
        },
        "filter" : {
            "geo_distance" : {
                "distance" : "80km",
                "location" : {
                    "lat" : 48.856614,
                    "lon" : 2.3522219
                }
            }
        }
    }
    }
    return locationQuery;
}



/*const HitItem = (props) => (
 <div className={props.bemBlocks.item().mix(props.bemBlocks.container("item"))}>
 <a className={props.bemBlocks.item("url")} href={props.result._source.url}>{props.result._source.url}</a>
 <p>{props.result._source.name}</p>
 </div>
 );*/

const HitItem = (props) => (
    <div className={props.bemBlocks.item().mix(props.bemBlocks.container("item"))}>
        <p>{props.result._source.profile.username}</p>
        <p>{props.result._source.location}</p>
    </div>
);

class Test extends React.Component {
    componentDidMount(){
        console.log(this.refs);
    }
    render(){
        return (<div>
                   <a ref="test" href="#"> hello sieutruc </a>
                </div>)
    }
}

class SearchApp extends SearchkitComponent {
    componentDidMount() {
        console.log(this.refs);
        console.log(this.props.children );
    }

    render() {
        return (
            <div>
                <div>
                    <div>
                        <Test/>
                        <SearchBox
                            searchOnChange={false}
                            queryBuilder={builder}/>
                    </div>


                    <Hits hitsPerPage={10} sourceFilter={["profile.username","emails","location"]}
                          mod="sk-hits-grid" itemComponent={HitItem}/>
                </div>
            </div>
        );
    }
}

export default class SearchPage extends React.Component {
    testClick() {
        searchkit.reloadSearch();
    }
    render() {
        return (
            <div>
                <div class="navbar navbar-searchbar">
                    <form class="form-horizontal searchElements">
                        <div class="form-group">
                            <div class="col-md-offset-2 col-md-2 col-sm-offset-2 col-sm-2 col-xs-offset-1 col-xs-5 ">
                                <select class="form-control " id="distanceOptions">
                                    <option value="10">10km</option>
                                    <option value="20">20km</option>
                                    <option value="40">40km</option>
                                    <option value="80">80km</option>
                                    <option value="200">200km</option>
                                </select>
                            </div>
                            <div class="col-md-2 col-sm-2 col-xs-5">
                                <div class='input-group date ' id='datetimepicker1'>
                                    <input type='text' placeholder="Time" class="form-control " />
                                    <span class="input-group-addon">
                                        <span class="glyphicon glyphicon-calendar"></span>
                                    </span>
                                </div>
                            </div>
                            <div class="input-group typeAheadSearch col-md-3 col-sm-4 col-xs-offset-1 col-xs-10">
                                <input class="form-control typeahead" id="searchbox" name="user" type="text" placeholder="Search..."  autocomplete="off" spellcheck="off" data-sets="users" data-highlight='true'/>
                                <span class="input-group-addon">
                                    <button class='searchButton trigger' id='searchtrigger'>
                                        <span class="glyphicon glyphicon-search"></span>
                                    </button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
                <SearchkitProvider searchkit={searchkit}>
                    <SearchApp/>
                </SearchkitProvider>
            </div>);
    }

}

