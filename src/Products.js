import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactTab from './ReactTab';
import Icon from '@material-ui/core/Icon';

 export default class Products extends React.Component{
	state = { prod:[], 
		auth:true,
		load:false,
		insert:false,
		insertToggle:false,
		insertData: {name:null,cost:0,price:0},
		del:false,
		nom: '',
		role:''  }
 	authError = ()=>{
 		this.setState({auth:false},alert("l'autentification a échouée, veuillez vous reconnecter!"));
		return <Redirect to="/" />
 	}
 	componentDidMount(){
 		let obj = this;
 		this.setState({load:true});
 		let jwt = sessionStorage.getItem('jwt');
 		if(jwt === null) { obj.authError() }
 		else{
	 		let payload = JSON.parse(atob(jwt.split('.')[1]));
			console.log(payload);
	 		fetch("http://127.0.0.1:8080/salhi_security/Controller/Products.php?jwt="+jwt)
	 		.then(function(prm){
	 			if(prm.status === 401){ obj.authError() }
	 			else if(prm.status === 200)	{
	 				prm.json().then(function(rep){ let del = payload.Role === 'admin' && true;
	 					let insert = del;
	 					obj.setState({prod:rep.data,load:false,insert,del,role:payload.Role,nom:payload.Nom})
	 				})
	 			}
	 		}).catch(function(rep){ alert("erreur "+rep+" au niveau du serveur") })
	 	}
 	}
 	handleInsert = (e) =>{
 		this.setState(state=>{ return {insertToggle:!state.insertToggle} });
 	}
 	insertChange = (e,type) =>{
		let ins = {...this.state.insertData};
		ins[type] = e.target.value;
 		this.setState({insertData:ins})
 	}
 	insertProd = () =>{
 		let jwt = sessionStorage.getItem('jwt');
 		let { insertData } = this.state;
 		fetch(`http://127.0.0.1:8080/salhi_security/Controller/insert_delete.php?
 		token=${jwt}&action=insert&Nom=${insertData.name}&Cout=${insertData.cost}&Prix=${insertData.price}`)
 		.then(prm=>{ return prm.text().then(rep=>{ alert(rep); window.location.reload() }) }).catch(msg=>{ alert(msg) })
 	}
 	deleteProd = line =>{
 		let jwt = sessionStorage.getItem('jwt'); 
 		let params = Object.keys(line).reduce((acc,cur)=>{ return acc.concat(`&${cur}=${line[cur]}`) },"")
 		fetch("http://127.0.0.1:8080/salhi_security/Controller/insert_delete.php?action=delete&token="+jwt+params)
 		.then(prm=>{ return prm.text() }).then(rep=>{ alert(rep); window.location.reload() })
 		.catch(msg=>{ alert(msg); })
 	}
	logout = ()=>{
		alert("Déconnexion");
		return (<Redirect to="/" />)
	}
 	render(){
		let { prod, auth, load, insert, del } = this.state;
		if(auth){
			let exm = del ? [{label:'Supprimer',icon:'delete',fct:this.deleteProd}] : [];
			return(
				<div>
				 <div style={{display:'flex',justifyContent:'space-between',heigth:'300px'}}> 
				 	<Typography variant="h5" color="primary" id="title">
				 	 {`Bonjour ${this.state.nom}, connecté en tant que ${this.state.role}`} 
				 	</Typography>
				 	<Link to="/"  style={{position:'fixed',top:'10px',right:'10px'}}> 
				 	<Icon fontSize="large" color="error" onClick={e=>this.logout(e)}>
				 	 power_settings_new
				 	</Icon>
              		</Link>
 				</div>
 				<br/><br/><br/>
				 <ReactTab
                 data={prod}
                 examine={exm}
                 filtre={{Nom:'text',Prix:'number'}}
                 //labels={['Id','Article','Ventes','Manque','Disponible','Demandés']}
                 table='Produits disponibles'
                />
				 <Button color="secondary" onClick={e=>this.handleInsert(e)}>
					Ajouter <Icon>add</Icon>
				 </Button>
				<Dialog open={this.state.insertToggle}>
					<DialogContent style={{display:'flex',justifyContent:'space-between'}} >
						<label htmlFor="nom"> Nom
						<input placeholder="Nom Produit" type="text" onChange={e=>this.insertChange(e,'name')} value={this.state.insertData.name}/>
						</label>
						<label htmlFor="cout"> Cout
						<input type="text" onChange={e=>this.insertChange(e,'cost')} value={this.state.insertData.cost}/>
						</label>
						<label htmlFor="prix"> Prix
						<input type="text" onChange={e=>this.insertChange(e,'price')} value={this.state.insertData.price}/>
						</label>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.insertProd} color="primary">
		                  Valider <Icon> send </Icon>
		                </Button>
		                <Button onClick={this.handleInsert} color="secondary">
		                  Annuler <Icon> clear </Icon>
		                </Button>
					</DialogActions>
				</Dialog>
				</div>
			)
		}
		else{
			return (<Redirect to="/" />)
		}
 	}
 }