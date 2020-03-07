import React from 'react'
import {Header, Segment, Input} from 'semantic-ui-react'

class MessagesHeader extends React.Component{
    render(){
        const{
            channelName,
            numUniqueusers,
            handleSearchChange,
            searchLoading
        } = this.props
    
        return(
            <Segment clearing>
                <Header fluid="true" as="h2" floated="left" style={{marginBottom:0}}>
                    <span>
                        {channelName}
                    </span>
                    <Header.Subheader>{numUniqueusers}</Header.Subheader>
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader