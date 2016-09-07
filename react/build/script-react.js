var Main = React.createClass({
     getInitialState: function() {
    return {servers: [] };
  },
       

    fetchAppsStatus: function() {
		console.log('fetching statuses ...');
		$.ajax({ 
			type: 'GET',
			url: this.props.rootUrl + '/status',
			dataType: "json", // data type of response
			success: function(data) {
			this.setState({servers: data});
		  }.bind(this),
		  error: function(xhr, status, err) {
			console.error(this.props.rootUrl, status, err.toString());
		  }.bind(this)
		});
	},

	componentDidMount: function() {
		//this.fetchAppsStatus();
		//setInterval(this.fetchAppsStatus, this.props.pollInterval);
  },
    render : function(){
		 var servers =  this.props.servers;
        if(servers){
            var serversToRender =  this.props.servers.map(function(server, index) {
            return (
                <Server serverName ={server.serverName} key={index} server = {server} rootUrl = {this.props.rootUrl}/>
                );
            }, this);
        }   
        
    return (
	<div>
      <h3>This is the list of heading</h3>
	   {serversToRender}
	 </div>
	 )
}});    

var Server = React.createClass({
	
	    sendCommandToServer: function(appName, action) {
		var destUrl = this.props.rootUrl + '/actions/' + this.props.serverName + '/' + appName + '?action=' + action;
		console.log('sending command ... ' + destUrl);
		$.ajax({
			type: 'GET',
			url: destUrl,
			success: function(data) {
				console.log('success !!!');
		  }.bind(this),
		  error: function(xhr, status, err) {
			console.error(this.props.rootUrl, status, err.toString());
		  }.bind(this)
		});
	},

    render: function () {
        var apps =  this.props.server.apps;
        if(apps){
            var appsToRender =  this.props.server.apps.map(function(app, index) {
            return (
                <App app = {app} key={index} sendCommandCallback = {this.sendCommandToServer}/>
                );
            }, this);
        }   

     return (
	<div>
      <h1>Server {this.props.serverName} </h1>
	   {appsToRender}
	 </div>
	 )
}}); 
    
                                   
var App = React.createClass({

	handleStartClick: function() {
		this.props.sendCommandCallback(this.props.app.appName, 'start');
    },
	
		handleStopClick: function() {
		this.props.sendCommandCallback(this.props.app.appName, 'stop');
    },
    
  render: function () {
	  var statusClass;
	  var btnStartClass = "btn btn-success btn-sm";
	  var btnStopClass = "btn btn-danger btn-sm";
	  var btnStartAttr = "";
	  var btnStopAttr = "";
	  
	  var isRunning = false;
	  
	  if(this.props.app.status == "running"){
		  isRunning = true;
		   statusClass = "label label-success";
		   btnStartClass += " disabled";
		   btnStopClass  += " active";  
		}  
	  else {
		  statusClass = "label label-danger";
		  btnStartClass += " active";
		  btnStopClass  += " disabled";  
	 }
		   	  
	  
    return (
      <div className="row">  
			<div className="col-md-4 centered-text">{this.props.app.appName} </div>
						
			<div className="col-md-2 centered-text">
				<span className="badge">{this.props.app.port}</span>
			 </div>
			 
			 <div className="col-md-4 centered-text">
				<h4><span className={statusClass}>{this.props.app.status}</span></h4>
			</div>
			 
			 <div className="col-md-1 centered-text">
			  <button type="button" className={btnStartClass} disabled={isRunning} onClick={this.handleStartClick}>Start</button>
			 </div>
			 
			 <div className="col-md-1 centered-text">
			  <button type="button" className={btnStopClass} disabled={!isRunning} onClick={this.handleStopClick}>Stop</button>
			 </div> 
      </div>
    )
  }
});


var data = [{
	serverName: "server1",
	apps: [{
		appName: "app1",
		status: "not running",
		port: 7500
	},
	{
		appName: "app2",
		status: "running",
		port: 7500
	},
	{
		appName: "app3",
		status: "running",
		port: 7500
	}]
},
{
	serverName: "server2",
	apps: [{
		appName: "app1",
		status: "running",
		port: 7000
	},
	{
		appName: "app1",
		status: "running",
		port: 7000
	},
	{
		appName: "app1",
		status: "running",
		port: 7000
	}]
}];

	
ReactDOM.render(
  <Main servers = {data}  rootUrl = 'localhost:8080'/>, document.getElementById('App')
);
