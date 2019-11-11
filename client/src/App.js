import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.scss';
import { HomePage } from './HomePage';
import { Mailer } from './Mailer'; 

//import { Header, Navigation, Footer, FirstLoading } from './components';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    }
  }
  
  componentDidMount(){
    this.setState({ isReady: true });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/sendMail" component={Mailer} />
        </Switch>
      </Router>
    )
  }

}

export default App;
