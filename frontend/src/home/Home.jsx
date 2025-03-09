import React from 'react';
import { AppHeader } from '../components/AppHeader.jsx';
import { AppFooter } from '../components/AppFooter.jsx';
import ArbList from '../components/ArbList';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      loading: false,
    };
  }

  render() {
    return (
      <div>
        <AppHeader />
        <div className="mt-10 flex w-full flex-col">
          <ArbList />
        </div>
        <AppFooter />
      </div>
    )
  }
}

export default Home