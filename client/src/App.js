import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.scss';
import { HomePage } from './HomePage';
import { ListProductPage } from './ListProductPage';
import { ProductPage } from './ProductPage';
import { Notfound } from './Notfound';
import { AdminPage } from './AdminPage';
import { MapDirection } from './MapDirection';
import { ContactPage } from './ContactPage';
import { SearchPage } from './SearchPage';

import { Header, Navigation, Footer, FirstLoading } from './components';

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
        { this.state.isReady
          ? <div className="container">
              <Header />
              <Navigation />
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/parts" component={ListProductPage} />
                <Route exact path="/parts/search" component={SearchPage} />
                <Route exact path="/parts/:pname" component={ListProductPage} />
                <Route path="/parts/:pname/:partid" component={ProductPage} />
                <Route path="/productmanager" component={AdminPage} />
                <Route path="/contact" component={ContactPage} />
                <Route path="/map&direction" component={MapDirection} />
                <Route component={Notfound} />
              </Switch>
              <Footer />
            </div>
          : <FirstLoading />
        }
      </Router>
    )
  }

}

export default App;
