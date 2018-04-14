var express = require('express');
var app = express();
 
var React = require('react'),
    ReactDOMServer = require('react-dom/server');
app.get('/', function(req, res) {
    var html = ReactDOMServer.renderToStaticMarkup(
        <Greeting name="Hello"/>
    );
    res.end(html);
});



export default class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

 
app.listen(3000, function() {
    console.log('running on port ' + 3000);
});

/*
   守护进程
   定时任务
   反向代理
*/
