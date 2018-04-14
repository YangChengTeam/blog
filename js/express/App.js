var createReactClass = require('create-react-class');
var React = require('react');
 
module.exports = createReactClass({
  getInitialState: function() {
   return {
     isSayBye: false
   }
  },
  handleClick: function() {
   this.setState({
     isSayBye: !this.state.isSayBye
   })
  },
  render: function() {
    var content = this.state.isSayBye ? 'Bye' : 'Hello World';
    return content;
  }
})