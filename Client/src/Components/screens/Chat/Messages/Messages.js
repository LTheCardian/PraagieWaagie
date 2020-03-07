import React from 'react'
import {Segment, Comment, Modal} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {setUserPosts} from  '../../../../actions'
import firebase from '../../../../firebase'


import MessagesHeader from './MessagesHeader'
import Typing from './Typing'
import MessageForm from './MessageForm'
import Message from './Message'

class Messages extends React.Component{
    state ={
        privateChannel: this.props.isPrivateChannel,
        privatesMessagesRef: firebase.database().ref("privateMessages"),
        messagesRef: firebase.database().ref("messages"),
        messages:[],
        messagesLoading:true,
        channel:this.props.curremtChannel,
        user:this.props.currentUser,
        usersRef: firebase.database().ref("users"),
        numUniqueUsers: "",
        typingRef: firebase.database().ref("typing"),
        typingUsers: [],
        connectedRef: firebase.database().ref("info/connected"),
        listeners:[],
        admin:false
    }

    componentDidMount(){
        const {channel, user, listeners} = this.state

        if(channel && user){
            this.removeListeners(listeners)
            this.addListeners(channel.id)
        }

        const userId = user.id
        firebase.database().ref("users/" + userId + "/admin").on("value", snap =>{
            if(snap.val() === true){
                this.setState({admin:true})
            }
        })
    }


    componentWillUnmount(){
        this.removeListeners(this.state.listeners)
        this.state.connectedRef.off()
    }

    removeListeners = listeners =>{
        listeners.forEach(listener =>{
            listener.ref.child(listener.id).off(listener.event)
        })
    }

    componentDidUpdate(prevProps, prevState){
        if(this.messagesEnd){
            this.scrollToBottom()
        }
    }
}
