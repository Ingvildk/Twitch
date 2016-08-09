import React from 'react/addons';
import Router from 'react-router';
import DownloadsStore from './DownloadsStore';
import ReactBootstrap from 'react-bootstrap';

var {
    Route, DefaultRoute, RouteHandler, Link
} = Router;
var path = require('path');
var {
    Col, Grid, Row, Button, Thumbnail
} = ReactBootstrap;

import Home from './HomeDirectory';


export default class Watch extends React.Component {

    constructor(props) {
        super(props);
      
    }

  	
    componentDidlMount() {
        var ID = this.context.router.getCurrentParams().videoId;
    
		DownloadsStore.listen(this.onChange.bind(this));
    }


     onChange(state) {
        this.setState(state);
    }    	

    render() {
        var ID = this.context.router.getCurrentParams().videoId;
        var dir = path.join(Home.getHomeDirectory(), 'twitch_videos', ID + '.mp4');
        var newValue = DownloadsStore.getState().downloads;
       

        var i;
        var item;
        //for(item in newValue) {
        // 
        //    if (item.id == ID) 
        //        i = item.title;
       	//}
       	newValue.forEach(function(record) {

       		 if (record.get("id") == ID) 
                i = record.get("title");
       	});
        
        return ( <div>
            <h3> 
            	{i} 
            </h3> 
            <video 
	            width="720"
	            height="640"
	            controls>
	            <source 
	            	src={dir}
	            type="video/mp4"/>
            </video> 
            </div> );
    }
};

Watch.contextTypes = {
    router: React.PropTypes.func.isRequired
};