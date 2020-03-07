import React from 'react'
import firebase from '../../../firebase'
import AvatarEditor from 'react-avatar-editor'
import {Grid, Header, Icon, Image,Form, Button, Input, Message, Modal} from 'semantic-ui-react'
import {Link, useHistory} from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import { Provider } from 'react-redux'
class UserPanel extends React.Component{
    state={
        user:firebase.auth().currentUser,
        usersRef:firebase.database().ref("users"),
        storageRef: firebase.storage().ref(),
        modal:false,
        uploadedCroppedImage:"",
        previewImage:"",
        croppedImage:"",
        currentUser: this.props.currentUser,
        userRef: firebase.auth().currentUser,
        blob:null,
        auth:firebase.auth(),
        reset:false,
        email:"",
        open:false,
        metadata:{
            contentType: "image/png"
        }
    }     
    openModal = () => this.setState({modal:true})
    closeModal = () => this.setState({modal:false})
    openReset = () => this.setState({reset:true})
    closeReset = () => this.setState({reset:false})
    openOpen = () => this.setState({open:true})
    closeOpen = () => this.setState({open:false})


    componentDidMount(){
        console.log(this.state.user)
    }


    uploadCroppedImage =() =>{
        const {storageRef, userRef, blob, metadata} = this.state
        
        storageRef
            .child(`avatars/users/${userRef.uid}`)
            .put(blob, metadata)

            .then(snap =>{
                snap.ref.getDownloadURL().then(downloadURL =>{
                    this.setState({uploadedCroppedImage:downloadURL}, () => 
                        this.changeAvatar()
                    )
                })
            })
    }   

    changeAvatar = () =>{
        this.state.userRef
            .updateProfile({
                photoURL: this.state.uploadedCroppedImage
            })
            .then(() => {
                console.log("Photourl updated")
                this.closeModal()
            })
            .catch(err =>{
                console.error(err)
            })

        this.state.usersRef
            .child(this.state.user.uid)
            .update({ avatar: this.state.uploadedCroppedImage })
            .then(()=> {
                console.log('User avatar updated')
            })
            .catch(err =>{
                console.error(err)
            })
    }

    handleChange = event =>{
        const file = event.target.files[0]
        const reader = new FileReader()

        if(file){
            reader.readAsDataURL(file)
            reader.addEventListener("load", () => {
                this.setState({ previewImage: reader.result})
            })
        }
    }


    handleCropImage = () =>{
        if(this.avatarEditor){
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob =>{
                let imageUrl = URL.createObjectURL(blob)
                this.setState({
                    croppedImage: imageUrl,
                    blob
                })
            })
        }
    }

    handleEventChange = event =>{
        this.setState({ [event.target.name]: event.target.value})
    }

    handleResetPassword = event =>{
        event.preventDefault()
        this.state.auth.sendPasswordResetEmail(this.state.email).then(()=>{
            this.setState({open:true})
        }).catch(err =>{
            console.error(err)
        }).then(()=>{
            this.setState({reset:false})
        }).catch(err =>{
            console.error(err)
        })
    }

    handleSignout = () => firebase.auth().signOut()
    render(){
        const{
            user,
            history,
            modal,
            previewImage,
            croppedImage, 
            currentUser
        } = this.state

        return(
            <Grid>
                <Grid.Column>
                    <Grid.Row textAlign="center"style={{paddingTop:"1.2em"}}>
                        <Header inverted floated="left">
                            <Link className="no" to="/"><Icon name="arrow left"/></Link>
                            <Header.Content>User Settings</Header.Content>
                        </Header>
                        <Icon name="sign-out" onClick={this.handleSignout} className="sign_out_icon" floated="right" size="large"/>
                    </Grid.Row>
                    <React.Fragment>
                        <Grid.Row>
                            <Grid.Column>
                                <Image
                                    src={user.photoURL}
                                    wrapped
                                    circular
                                    onClick={this.openModal}
                                    className="avatar-image"
                                    size="small"
                                /> 
                                <p className="avatar-text" onClick={this.openModal}>Change avatar</p>
                            </Grid.Column>
                        </Grid.Row>
                    </React.Fragment>
                    <React.Fragment>
                        <Grid.Row>
                            <Grid.Column className="grid-name">
                                <Header inverted>
                                    <Header.Content>
                                        User name:
                                        <br/>
                                        {user.displayName}
                                        <br/>
                                        <br/>
                                        Email:
                                        <br/>
                                        {user.email}
                                        <br/>
                                        <br/>
                                        Provider:
                                        <br/>
                                        {user.providerData[0].providerId}
                                    </Header.Content>
                                </Header>
                                <Button onClick={this.openReset}>Change password</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </React.Fragment> 
                    <Modal open={modal} onClose={this.closeModal} closeIcon>
                        <Modal.Header>Change avatar</Modal.Header>
                        <Modal.Content>
                            <Input
                                onChange={this.handleChange}
                                fluid
                                type="file"
                                name="previewImage"
                            />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui centered aligned grid">
                                        {previewImage && (
                                            <AvatarEditor
                                                ref={node => (this.avatarEditor = node)}
                                                image={previewImage}
                                                width={200}
                                                height={200}
                                                border={50}
                                                scale={1}
                                            />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {croppedImage && (
                                            <Image
                                                style={{margin: "3.5em auto"}}
                                                width={200}
                                                height={200}
                                                src={croppedImage}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage && (
                                <Button 
                                    color="green"
                                    inverted 
                                    onClick={this.uploadCroppedImage}
                                >
                                    <Icon name="save"/> Change avatar
                                </Button>
                            )}
                            <Button color="red" inverted onClick={this.closeModal}>
                                <Icon name="remove" /> Cancel
                            </Button>
                            <Button color="green" inverted onClick={this.handleCropImage}>
                                <Icon name="image" /> Preview
                            </Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal open={this.state.reset} onClose={this.closeReset} size="mini">
                        <Modal.Header>
                            Wachtwoord vergeten
                        </Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={this.handleResetPassword} size="mini">
                                <Form.Input
                                    fluid
                                    name="email"
                                    icon="mail"
                                    placeholder="email"
                                    onChange={this.handleEventChange}
                                    value={this.state.email}
                                    type="email"
                                    iconPosition="left"
                                />
                                <Button 
                                    color="grey"
                                    fluid
                                    size="large"
                                >
                                    Submit
                                </Button>
                            </Form>
                        </Modal.Content>
                    </Modal>
                    <Snackbar open={this.state.open} autoHideDuration={3000} onClose={this.closeOpen}>
                        <Alert onClose={this.closeOpen} severity="success">
                            Email send!
                        </Alert>
                    </Snackbar>
                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPanel