import React from "react";
import { Menu, Button } from "semantic-ui-react";
import {Link} from 'react-router-dom'
import Channels from "./Channels";

class SidePanel extends React.Component {
  render() {
    const { currentUser} = this.props;

    return (
    //   <Menu
    //     size="large"
    //     inverted
    //     fixed="left"
    //     vertical
    //     style={{fontSize: "1.2rem"}}
    //     className="menuUserpanel"
      
    //   >
        <Channels currentUser={currentUser}/>
    //   </Menu>
    );
  }
}

export default SidePanel;
