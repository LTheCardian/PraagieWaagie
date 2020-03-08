import React from 'react'
import {Menu} from 'semantic-ui-react'
import Channels from './Channels'

class SidePanel extends React.Component{
    render(){
        const {currentUser} = this.props
        return(
            <Channels currentUser={currentUser}/>    
        )
    }
}

export default SidePanel