import React from 'react';
import SweetAlert from 'sweetalert2-react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from 'react-select';
import InputLabel from '@material-ui/core/InputLabel';
import Icon from '@material-ui/core/Icon';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

class FormAjout extends React.Component {
	constructor(props) {	
		super(props);
        let fores=[];
        props.types.map((e,i)=> {e==='foreign' ? fores.push(props.labels[i]) : false});
		this.state={
			vals:{},
            fores:fores,
            files:[],
		}
	}
    selectImage = (ev)=>{
        var idd=ev.target.id;
        //file.append(idd,ev.target.files[0]);
        this.setState((state,props)=>{return {files:state.files.concat(idd)}});
        var reader = new FileReader();
          reader.onload = function (e) {
            document.getElementById("img"+idd).setAttribute('src', e.target.result);
          };
        reader.readAsDataURL(ev.target.files[0]);
     }  
	handleChange = (ev,name) =>{
		let val=ev.target.value;
		let tmp=this.state.vals;
		tmp[name]=val;
		this.setState({vals:tmp});
	}
	selChange = (ev,name) =>{
		let val=ev.value;
		let tmp=this.state.vals;
		tmp[name]=val;
		this.setState({vals:tmp});	
	}
	handleCheck = (ev,checked) => {
		let classe=ev.target.parentElement.className;
		let val=ev.target.value;
		let tmp=this.state.vals;
		checked ? tmp[classe].push(val) : tmp[classe]=tmp[classe].filter(e => e!=val);
		this.setState({vals:tmp});
	}
	handleSwitch = name => {
		let vals=this.state.vals;
    	vals[name]=!vals[name];
    	this.setState({vals});
	 }


	inputs= (key) => { let req=this.props.required.includes(this.props.labels[key]);
		let fore=-1;
		let labIcon=[<span></span>];
		if(this.props.icons[this.props.labels[key]] !== 'undefined') 
		{	labIcon=<Icon>{this.props.icons[this.props.labels[key]]}</Icon> }
		if(this.props.types[key].includes('text'))
		{ 	return  <InputLabel>{labIcon} <TextField
          className={this.props.labels[key]}
          required={req}
          label={this.props.labels[key]}
          hintText={this.props.labels[key]}
          multiLine={true}
          value={typeof this.state.vals[this.props.labels[key]]==='undefined' ? '' : this.state.vals[this.props.labels[key]] }
          onChange={e=>this.handleChange(e,this.props.labels[key])} /></InputLabel> 
      	}
		else if(this.props.types[key].substring(0,3)==="int")
		{ return <InputLabel>{labIcon}<TextField
		    className={this.props.labels[key]}
		    required={req}
		    label={this.props.labels[key]}
		    type='number'
		    step={1}
		   // hintText={this.props.labels[key]}
		    value={typeof this.state.vals[this.props.labels[key]]==='undefined' ? null : this.state.vals[this.props.labels[key]] }
		    onChange={e=>this.handleChange(e,this.props.labels[key])} /> </InputLabel>  	
		}
		else if (this.props.types[key].substring(0,7)==="decimal")
		{	//récupérer la précission de la décimale
			var step=this.props.types[key].replace(/(decimal\()([0-9]+,)([0-9])(\))/, '$3');
			step=1/Math.pow(10,parseInt(step));
		 return	<InputLabel>{labIcon}<TextField
		    className={this.props.labels[key]}
		    required={req}
		    label={this.props.labels[key]}
		    type='number'
		    step={step}
		    hintText={this.props.labels[key]}
		    value={typeof this.state.vals[this.props.labels[key]]==='undefined' ? '' : this.state.vals[this.props.labels[key]] }
		    onChange={e=>this.handleChange(e,this.props.labels[key])} /></InputLabel>
		}
		else if (this.props.types[key]==="date")
		{ const DateTimeFormat = global.Intl.DateTimeFormat;
		 return	<InputLabel>{labIcon} <TextField
		        label={this.props.labels[key]}
		        type="date"
		        value={typeof this.state.vals[this.props.labels[key]]==='undefined' ? '' : this.state.vals[this.props.labels[key]] }
		        className={this.props.labels[key]}
		        required={req}
		        onChange={e=>this.handleChange(e,this.props.labels[key])} /> </InputLabel>

		 	 /*<DatePicker
			className={this.props.labels[key]}
		    hintText={this.props.labels[key]}
		    DateTimeFormat={DateTimeFormat}
		    formatDate={(date) => date.toISOString().substring(0,10)}
		    okLabel="OK"
		    cancelLabel="Annuler"
		    openToYearSelection={true}
		    locale="fr"
		    mode='landscape'
		    firstDayOfWeek={0}
		    value={dtmin.length > 1 ? new Date(dtmin) : ''} //.toLocaleDateString()}
		    autoOk={true}
		    onChange={this.handleChange} />*/
		}
		else if (this.props.types[key].substring(0,4)==="time")
		{ /*var dtmin=typeof this.state.vals[this.props.labels[key]] == 'undefined' ? '' : typeof this.state.vals[this.props.labels[key]]['begin'] == 'undefined' ? '' : this.state.vals[this.props.labels[key]];
			let dn=new Date();
			dn.setHours(dtmin.substring(0,2));
			dn.setMinutes(dtmin.substring(3,5)); */
			return <InputLabel>{labIcon}<TextField
		        label={this.props.labels[key]}
		        type="time"
		        value={typeof this.state.vals[this.props.labels[key]] ==='undefined' ? '' : this.state.vals[this.props.labels[key]] }
		        className={this.props.labels[key]}
		        required={req}
		        onChange={e=>this.handleChange(e,this.props.labels[key])} /></InputLabel>
			}
		else if (this.props.types[key].substring(0,4)==="enum")
		{	var possible=this.props.types[key].substring(5,this.props.types[key].length-1).replace(/'/g,'');
			possible=possible.split(',');
			let enums=[];
			possible.map(e => { //e=e.match(/[^^']+/);
				enums.push( <FormControlLabel value={e} control={<Radio />} label={e} /> )
			});
			return(
		<FormControl component="fieldset" required={req} className={this.props.labels[key]}>
          <FormLabel component="legend">{labIcon} {this.props.labels[key]}</FormLabel>
          <RadioGroup
            aria-label={this.props.labels[key]}
            name={this.props.labels[key]}
            value={typeof this.state.vals[this.props.labels[key]]==='undefined' ? '' : this.state.vals[this.props.labels[key]]}
            onChange={e=>this.handleChange(e,this.props.labels[key])}
          >
				{enums}
			</RadioGroup>
		</FormControl>)
		}
		else if (this.props.types[key].substring(0,3)==="set")
		{	var possible=this.props.types[key].substring(4,this.props.types[key].length-1);
			possible=possible.split(',');
			let sets=[];
			possible.map(e => {
		 		sets.push(<FormControlLabel
		          control={
		            <Checkbox
		              checked={this.state.vals[key]==e ? true : false}
		              onChange={this.handleCheck}
		              value={e}
		            />
		          }
		          label={e}
		          required={req}
		        />)
		 	//<Checkbox className={this.props.labels[key]} label={e} value={e} checked={this.state.vals[key]==e ? true : false} onCheck={this.handleCheck}/>)
			});
			return
			<FormControl component="fieldset">
        		<FormLabel component="legend">{labIcon}{this.props.labels[key]}</FormLabel>
        		<FormGroup>
        			{sets}
        		</FormGroup>
        	</FormControl>

		}
		else if (this.props.types[key]=="foreign") {
            let fore=this.state.fores.indexOf(this.props.labels[key]);
            let long=typeof this.props.foreigns[fore] == 'object' ?
            Math.log10(this.props.foreigns[fore].reduce((cum,acc)=>{return Math.max(cum,acc.label.length)},0)) : 0;
            return(<InputLabel style={{width:long*30+'%'}}>{this.props.labels[key]+" ("+this.props.foreigns[fore].length+")"} {labIcon}
				<Select
		          id={this.props.labels[key]}
		          className={this.props.labels[key]}
		          required={req}
		          placeholder={`Choix ${this.props.labels[key]}`}
		          onBlurResetsInput={false}
		          onSelectResetsInput={true}
		          options={this.props.foreigns[fore]}
		          clearable={true}
		         // defaultValue={this.props.vals[this.props.labels[key]]}
		          onChange={e=>this.selChange(e,this.props.labels[key])}
		          searchable={true}
				/></InputLabel>			);
		}
		else if (this.props.types[key]=="bool") {
			return (<InputLabel>{labIcon}<FormControlLabel
            control={
              <Switch
                checked={this.state.vals[this.props.labels[key]]}
                onChange={this.handleSwitch}
                value={this.state.vals[this.props.labels[key]]}
              />
            }
            label={this.props.labels[key]}
            required={req}
          /></InputLabel>)
		}
        else if(this.props.types[key]=="password"){
            return <InputLabel style={{display:'flex'}}>{labIcon}<TextField
          className={this.props.labels[key]}        
          style={{flex:1}}
          type="password"
          required={req}        
          label={this.props.labels[key]}
          hintText={this.props.labels[key]}
          value={this.state.vals[this.props.labels[key]]}
          onChange={e=>this.handleChange(e,this.props.labels[key])}
          /></InputLabel>
        }
		else if(this.props.types[key].substring(0,7)=="varchar"){
			let long=parseInt(this.props.types[key].match(/[0-9]+/))/255;
			return <InputLabel style={{display:'flex',flex:long}}>{labIcon}<TextField
          className={this.props.labels[key]}		
          style={{flex:1}}
          required={req}        
          label={this.props.labels[key]}
          hintText={this.props.labels[key]}
          value={this.state.vals[this.props.labels[key]]}
          onChange={e=>this.handleChange(e,this.props.labels[key])}
          /></InputLabel>
		}
        else if(this.props.types[key].includes("image")){
          return (
            <span style={{margin:'20px 20px 20px 20px'}}>
              <input accept="image/*" id={this.props.labels[key]} onChange={this.selectImage}
                style={{display:'none'}} multiple={this.props.types[key].includes("multi")} type="file" />
              <label htmlFor={this.props.labels[key]}>
                <Button variant="contained" component="span">
                  {this.props.labels[key]} <Icon>add_photo_alternate</Icon>
                </Button>
              </label>
              <img width='50px' height='50px' id={"img"+this.props.labels[key]} alt={`image${this.props.labels[key]}`}/>
            </span>
          )
        }
		else {
		return (<InputLabel>{labIcon}<TextField
          className={this.props.labels[key]}		
          required={req}        
          label={this.props.labels[key]}
          hintText={this.props.labels[key]}
          value={this.state.vals[this.props.labels[key]] }
          onChange={e=>this.handleChange(e,this.props.labels[key])}
          /></InputLabel>)
		}
	}
	
	handleSave = () =>{
		let vals=this.state.vals;
        let frmdt=new FormData();
  
        Object.keys(vals).map(k=>{
          frmdt.set(k,vals[k]);
        });
        this.state.files.map(file=>{  //les fichiers sont ajoutés à la fin pour écraser la clé vals
          frmdt.set(file,document.getElementById(file).files[0]);
        });
		this.props.save(frmdt);
	}
	handleReset = () =>{
		let vals=this.state.vals;
		Object.keys(vals).map(e => vals[e]=null);
		this.setState({vals});
	}

	render(){
		const frm=[];
		Object.keys(this.props.labels).map(key => frm.push(this.inputs(key)));
		return(
			<form onSubmit={this.handleSubmit} style={{display:'flex',flexDirection:'column',marginRight:'10%',marginLeft:'10%'}} >
				<div className="formData" style={{display:'flex',flexWrap:'wrap',justifyContent:'space-around', alignItems:'center',marginBottom:'20px'}}>
					{frm}
				</div>
				<div id="formActions" style={{display:'flex',justifyContent:'end',marginRight:'10%'}} >
					<Button variant="raised" color="secondary" style={{marginRight:'20px'}} onClick={this.handleReset}>
	                 Mise à zéro <Icon> cancel </Icon>
	                </Button>				
	                <Button variant="raised" color="primary" style={{marginRight:'20px'}} onClick={this.handleSave}>
	                 Enregistrer <Icon> save </Icon>
	                </Button>		
                </div>		
			</form>
		)
	}
}
export default FormAjout;

