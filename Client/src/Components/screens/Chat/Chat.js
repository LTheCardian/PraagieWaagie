import React from 'react'
import {Grid} from 'semantic-ui-react'
import '../../App.css'
import {connect} from 'react-redux'
import Messages from './Messages/Messages'
import SidePanel from './SidePanel/SidePanel'
import {Sidebar} from 'semantic-ui-react'
const Chat = ({currentUser, currentChannel, isPrivateChannel}) => (
    <Grid columns="equal" className="app" style={{background:"#1b1c1d"}}>
        <SidePanel key={currentUser && currentUser.uid} currentUser={currentUser}/>
        <Grid.Column>
            <Sidebar.Pusher>
                <Messages
                    key={currentChannel && currentChannel.id}
                    currentChannel={currentChannel}
                    currentUser={currentUser}
                    isPrivateChannel={isPrivateChannel}
                />
            </Sidebar.Pusher>
        </Grid.Column>
    </Grid>
)

const mapStateToProps = state => ({
    currentUser:state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel
})

export default connect(mapStateToProps)(Chat)