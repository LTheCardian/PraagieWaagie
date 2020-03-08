import React from'react'
import firebase from '../../../../firebase'
import {connect} from 'react-redux'
import {setCurrentChannel, setPrivateChannel} from '../../../../actions'
import { Menu, Icon, Segment } from 'semantic-ui-react'
import Sidebar from 'react-sidebar'
class Channels extends React.Component{
    state = {
        activeChannel:"",
        user: firebase.auth().currentUser,
        channel:null,
        channels:[],
        channelDetails:"",
        channelsRef:firebase.database().ref("channels"),
        messagesRef: firebase.database().ref("messages"),
        typingRef: firebase.database().ref("typing"),
        notifications:[],
        firstLoad:true,
        modal:false,
        uwu:true
    }

    openModal = () => this.setState({modal:true})
    closeModal = () => this.setState({modal:false})
    openUwu = () => this.setState({uwu:true})
    closeUwu = () => this.setState({uwu:false})
    componentDidMount(){
        this.addListeners()
    }

    componentWillUnmount(){
        this.removeListeners()
    }

    addListeners = () =>{
        let loadedChannels = []
        this.state.channelsRef.on('child_added', snap =>{
            loadedChannels.push(snap.val())
            this.setState({channels:loadedChannels}, () => this.setFirstChannel())
            this.addNotificationListeners(snap.key)
        })
    }

    addChannel = () =>{
        const {channelsRef, channelName, channelDetails, user} = this.state
        
        const key = channelsRef.push().key

        const newChannel = {
            id:key,
            name:channelName,
            details:channelDetails,
            createdBy:{
                name:user.displayName,
                avatar: user.photoURL
            }
        }

        channelsRef 
            .child(key)
            .update(newChannel)
            .then(()=>{
                this.setState({channelName:"", channelDetails:""})
                this.closeModal()
                console.log('channel added')
            }).catch(e =>{
                console.error(e)
            })
    }

    handleSubmit = event =>{
        event.preventDefault()
        if(this.isFormValid(this.state)){
            this.addChannel()
        }
    }

    handleChange = event =>{
        this.setState({ [event.target.name ]: event.target.value})
    }

    addNotificationListeners = channelId =>{
        this.state.messagesRef.child(channelId).on('value', snap =>{
            if(this.state.channel){
                this.handleNotifications(
                    channelId,
                    this.state.channel.id,
                    this.state.notifications,
                    snap
                )
            }
        })
    }

    handleNotifications = (channelId, currentChannelId, notifications, snap) =>{
        let lastTotal = 0

        let index = notifications.findIndex(
            notification => notification.id === channelId
        )

        if(index !==-1){
            if(channelId !== currentChannelId){
                lastTotal = notifications[index].total

                if(snap.numChildren() - lastTotal > 0){
                    notifications[index].count = snap.numChildren() - lastTotal
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren()
        }else{
            notifications.push({
                id:channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count:0
            })
        }

        this.setState({notifications})
    }

    removeListeners = () =>{
        this.state.channelsRef.off()
    }

    setFirstChannel = () =>{
        const firstChannel = this.state.channels[0]
        if(this.state.firstLoad && this.state.channels.length > 0){
            this.props.setCurrentChannel(firstChannel)
            this.setActiveChannel(firstChannel)
            this.setState({channel:firstChannel})
        }
        this.setState({firstLoad:false})
    }

    changeChannel = channel =>{
        this.setActiveChannel(channel)
        this.state.typingRef
            .child(this.state.channel.id)
            .child(this.state.user.uid)
            .remove()
        this.clearNotifications()
        this.props.setCurrentChannel(channel)
        this.props.setPrivateChannel(false)
        this.setState({channel})
    }

    clearNotifications = () =>{
        let index = this.state.notifications.findIndex(
            notification => notification.id === this.state.channel.id
        )

        if (index !== -1){
            let updatedNotifications = [...this.state.notifications]
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal
            updatedNotifications[index].count = 0
            this.setState({notifications:updatedNotifications})
        }
    }

    setActiveChannel = channel => {
        this.setState({activeChannel:channel.id})
    }

    getNotificationCount = channel =>{
        let count = 0
        
        this.state.notifications.forEach(notification =>{
            if(notification.id === channel.id){
                count = notification.count
            }
        })

        if (count > 0) return count
    }

    displayChannels = channels =>
        channels.length > 0 &&
        channels.map(channel => (
            <div>
                <Menu.Item
                    key={channel.id}
                    onClick={() => this.channelChannel(channel)}
                    name={channel.name}
                    style={{opacity:0.7}}
                    active={channel.id === this.state.activeChannel}
                >
                    # {channel.name}
                </Menu.Item>
            </div>
        ))

        isFormValid = ({channelName, channelDetails}) =>
            channelName && channelDetails
        
        render(){
            const {channels, modal} = this.state
            return(
                <Sidebar
                    sidebar={this.displayChannels(channels)}
                    open
                    onSetOpen ={ this.openUwu}
                    styles={{sidebar: {background: "white"}}}
                >
                    <button onClick={this.openUwu}>
                        Open
                    </button>
                </Sidebar>
            )
        }

}

export default Channels