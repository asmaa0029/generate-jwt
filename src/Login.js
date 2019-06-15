import React from 'react';
import { Redirect } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class Login extends React.Component {
	constructor(props)
  	{ super(props);  
	 this.state={
		user:'',
		password:'',
		visible_password:false,
		message:'',
		role:'',
		logged:false,
		jwt:{}
		}
	}
	changeUser = e =>{
		this.setState({user:e.target.value})
	}
	changePassword=(e) =>{
		this.setState({password:e.target.value})
	}
	changeVisibility = () =>{
		//let etat=this.state.visible_password;
		this.setState({visible_password:!this.state.visible_password});
	}
	login = (e) =>{
		document.getElementById('erreur').innerHTML="";
		let obj=this;
		e.preventDefault();
		fetch("http://127.0.0.1:8080/salhi_security/Controller/Login.php", {
			method: 'POST',
			mode: 'cors',
		    headers:{ 'Access-Control-Allow-Methods': 'POST',
		    'Content-type':'application/x-www-form-urlencoded','Access-Control-Allow-Origin':'*'},
		 	body: "user="+obj.state.user+"&password="+obj.state.password
		 	}).then(function(rep){ if(rep.status===401){ alert("unauthorized");
		 	 obj.setState({message:'Identifiants éronnés'})
		 	 return false } else{
		 		return rep.text().then(function(jwt){
				obj.setState({message:'Ok',jwt:jwt,logged:true},sessionStorage.setItem('jwt',jwt))
		 	})}})
		 		.catch(function(rep){ obj.setState({message:"Problème lors de la tentative d'accès au serveur !"+rep}) })
	}
	confirm = (e)=>{
		if(e.which===13) { document.getElementById('boutLog').click() }
	}	
	handleChange = (event)=>{
		this.setState({selectedMag:event.target.value});
	}
	
	render(){		
		if(this.state.logged){
			return (<Redirect push to="/Products"/>)
		}
		let passType=this.state.visible_password ? 'text' : 'password';
		let icon=this.state.visible_password ? 'visibility_off' : 'visibility';
		return(
		<div style={{display:'flex',justifyContent:'center'}}>
	  <Paper elevation={1} style={{width:'50%',marginTop:'50px'}} >
        <Typography variant="headline" color='secondary' style={{paddingLeft:'30%',justifyContent:'center',backgroundColor:'#ddd'}}>
        	Connexion Salhi
        </Typography>
		<form onSubmit={this.login} id='connexion' method='POST' action='/Sondabaz/Controller/login.php'
		 style={{display:'flex',flexFlow:'wrap column',justifyContent:'space-around'}}>
			<TextField
				id='user'
				label='Utilisateur'
				value={this.state.user}
				onChange={this.changeUser}
				InputProps={{
				 startAdornment: (
					<InputAdornment position="end">
		              <Icon style={{float:'right',marginRight:'25px',marginLeft:'5px'}} onClick={this.changeVisibility}>account_circle</Icon>
		            </InputAdornment> ),
		        }}
			/>
			<TextField
				id='password'
				label='Mot de passe'
				type={passType}
				value={this.state.password}
				onChange={this.changePassword}
				onKeyPress={this.confirm}
				InputProps={{
		          startAdornment: (
		            <InputAdornment position="end">
		              <Icon style={{float:'right',marginRight:'25px',marginLeft:'5px'}} onClick={this.changeVisibility}> {icon} </Icon>
		            </InputAdornment>
		          ),
		        }}
			/>
			<h3 id="erreur"></h3>
			<Button id="boutLog" variant="contained" color="primary"
			 style={{width:'40%',margin:'30px 30px 30px 30px',float:'right'}} 
			 onClick={e=>this.login(e)}>
       			Se connecter <Icon>add_to_home_screen</Icon>
      		</Button>
      		<Typography variant="title" color="error" id="message"> {this.state.message} </Typography>
		</form>
      </Paper>
    </div>
	)}
}