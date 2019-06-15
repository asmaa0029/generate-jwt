import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
//import Select from 'react-select';
import Fab from '@material-ui/core/Fab';
import { lighten } from '@material-ui/core/styles/colorManipulator';

function getSorting(order, orderBy) {
  if( typeof orderBy === 'string'){
    return order === 'desc'
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }
}
const headStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  head:
    { fontSize:16,
      fontWeight:'bold',
      color:'white',
      backgroundColor: theme.palette.primary.main,
    }
});

class ReactTabHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };
  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, checkb, labels, classes } = this.props;
    return (
      <TableHead className={classes.head}>
        <TableRow>
        { checkb ? (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}  />
          </TableCell>) : false } 
          {labels.map((column,num) => {
            if(!this.props.invisibles.includes(column)) { return(
              <TableCell className={classes.head}
                key={`col${column}`}
                sortDirection={orderBy === column ? order : false}
              >
               {typeof this.props.icons !== 'undefined' ? <Icon>{this.props.icons[num]}</Icon> : false}
                <Tooltip
                  title="Trier"
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === this.props.cols[num]}
                    direction={order}
                    onClick={this.createSortHandler(column)}
                  >
                  {column}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            )};
          }, this)}
          { this.props.examine ? 
            this.props.examine.map(e=>{
             return(<TableCell className={classes.head}>{e.label}</TableCell> ) })
            : false }
             </TableRow>
      </TableHead>
    );
  }
}

ReactTabHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  //orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired};
ReactTabHead = withStyles(headStyles)(ReactTabHead);
const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  head:
    {
     color: theme.palette.secondary.main,
      backgroundColor: lighten(theme.palette.primary.light, 0.85),
    },
  spacer: {
    flex: '1 1 100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});
 
let ReactTabToolbar = props => {
  const { numSelected, examines, fctLines, classes } = props;
  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.heading]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selectionnées
          </Typography>
        ) : (
          <Typography variant="title" color="primary" id="tableTitle">
            {props.table}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        { numSelected > 0 ? (
         <span key='commandesTab' style={{width:'75px',display:'flex',alignContent:'row',justifyContent:'space-between'}}>
         {examines.map((exam,i)=>{
          return( <Tooltip title={exam.label}><Icon color="secondary" onClick={e=>props.fctLines(i,e)}>{exam.icon}</Icon></Tooltip> )})
        } </span> ) : ( false )}
      </div>
    </Toolbar>
  );
};

ReactTabToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

ReactTabToolbar = withStyles(toolbarStyles)(ReactTabToolbar);
const styles = theme => ({ 
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  addButt:{fontSize:'3em'},
  resetButt:{fontSize:'2em',float:'right'},
  sendButt:{float:'right'},
  avatar: {margin: 10,},
  bigAvatar: {width: 60,height: 60,},
});

class ReactTab extends React.Component {
  constructor(props) {
    super(props);
    const { classes } = props;
    let fil=typeof this.props.filtre !== 'undefined'
     ? (Object.keys(this.props.filtre).reduce((acc,cur)=>{ acc[cur]=new Object(); return acc},{})) : {};
    let ord= this.props.data.length > 0 ? Object.keys(props.data[0])[0] : null;
    let rows=typeof this.props.rows === 'undefined' ? 5 : this.props.rows;
    const dt=props.data;
    this.state = {
      order: 'asc',
      orderBy: ord,
      selected: [],
      data: [],
      changed:[],
      page: 0,
      rowsPerPage: rows,
      filters:fil,
    };
  }
  componentDidMount(){
    let first = this.props.data.length > 0 ? Object.keys(this.props.data[0])[0] : null;
    this.setState({data:this.props.data})
  } 
 getSnapshotBeforeUpdate(prevProps, prevState) {
    if(prevState.orderBy!==this.state.orderBy || prevState.order!==this.state.order || prevState.filters!==this.state.filters ){
      this.setState(state=>{ return {data:this.updateData(this.state.changed).sort(getSorting(this.state.order, this.state.orderBy))} });
    }
    if(JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data) ){
      this.setState(state=>{ return {data:this.updateData(this.state.changed).sort(getSorting(this.state.order, this.state.orderBy))} });
    }
    if(prevState.data!==this.state.data && this.props.onChangeState && prevState.data.length === this.state.data.length){
      this.props.onChangeState(this.state.data);
    }
  }
  updateData = (changed) =>{
     const { order, orderBy, selected, rowsPerPage, page } = this.state;
      let id=this.props.data.length > 0 ? Object.keys(this.props.data[0])[0] : [];
      let ids=changed.map(d=>d[id]);
      let dt = this.filtredData(this.props.data).map(line=>{
        if(ids.includes(line[id])) { return changed.filter(f=>f[id]===line[id])[0] }
        else { return line }
      });
    return dt;
  }
  reset=(e)=>{
    e.preventDefault();
    this.resetFilter();
  }
  changeFilter=(ev,label,type)=>{  
    let filters=this.state.filters;
    filters[label][type]=ev.target.value;   
    this.setState({filters,data:this.updateData(this.state.changed)});
  }
  changeSet = (v,label)=>{
    let f = {...this.state.filters};
    f[label]['in']=[v];
    this.setState({filters:f,data:this.updateData(this.state.changed)});
  }
  filtredData=(dt)=>{
     let data=dt.filter(line=>{
      let filtred=true;
        Object.keys(this.state.filters).map(e=>{
        if(this.state.filters[e]['val'] && !line[e].toLowerCase().includes(this.state.filters[e]['val'].toLowerCase())) { filtred=false }
        else if(this.state.filters[e]['in'] && !this.state.filters[e]['in'].includes(line[e])) { filtred=false }  
        else if(this.state.filters[e]['min'] && line[e] < this.state.filters[e]['min']) { filtred=false }
        else if(this.state.filters[e]['max'] && line[e] > this.state.filters[e]['max']) { filtred=false }
        else if(this.state.filters[e]['begin'] && new Date(line[e]).getTime() < new Date(this.state.filters[e]['begin']).getTime()) { filtred=false }
        else if(this.state.filters[e]['end'] && new Date(line[e]).getTime() > new Date(this.state.filters[e]['end']).getTime()) { filtred=false }
      });
      return filtred;
    }); 
    return data;
  }
   handleRange = (which,playload)=>{
    let start=new Date(playload.startDate['_d'].getFullYear()+'-'+parseInt(playload.startDate['_d'].getMonth()+1)+'-'+playload.startDate['_d'].getDate());
    let end=new Date(playload.endDate['_d'].getFullYear()+'-'+parseInt(playload.endDate['_d'].getMonth()+1)+'-'+playload.endDate['_d'].getDate());
    let filters=this.state.filters;
    filters[which]['begin']=start;
    filters[which]['end']=end;
    let data=this.props.data.filter(line=>{ return new Date(line[which]) >= start && new Date(line[which]) <= end});
    this.setState({filters,data});
  }
  resetFilter=(e)=>{
    e.preventDefault();
    let fil=typeof this.props.filtre !== 'undefined' ? (Object.keys(this.props.filtre).reduce((acc,cur)=>{ acc[cur]=new Object(); return acc},{})) : null;
    this.setState({filters:fil,data:this.props.data}); 
  }
  handleRequestSort = (event, property) => {
    if(typeof this.props.labels !== 'undefined' && this.props.data.length > 0){
      let pos=this.props.labels.indexOf(property);
      property=Object.keys(this.props.data[0])[pos];
    }
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };
  handleSelectAllClick = (event, checked) => {
    if (checked) {
      let id0=Object.keys(this.props.data[0])[0];
      this.setState((state,props) => ({ selected: props.data.map(n => n[id0]) }));
      return;
    }
    this.setState({ selected: [] });
  };
  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    this.setState({ selected: newSelected });
  };
  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  handleChangeRowsPerPage = event => {
    this.setState((state,props)=>{ return {rowsPerPage: Math.min(event.target.value,this.filtredData(props.data).length)}});
  };
  examineLine = (n,i,e) =>{
    let id=Object.keys(this.props.data[0])[0];
   this.setState({ selected: [] },this.props.examine[i].fct(n));
  }
  fctLines = (i,e) =>{
    let id=Object.keys(this.props.data[0])[0];
    let selData=this.state.data.filter(line=>this.state.selected.includes(line[id]));
   this.setState({ selected: [] },this.props.examines[i].fct(selData));
  }
  handleChange = (e,cell,n)=>{
    let id=Object.keys(this.props.data[0])[0];
    let ids=this.state.changed.map(d=>d[id]);
    let line={...n};
    let changed = this.state.changed;
    line[cell]=e.target.value;
    if(!ids.includes(line[id])) { changed.push(line) }
    else { changed.map(c=> c[id]===line[id] ? c[cell]=line[cell] : false ) }
    this.props.onChangeState ? 
    this.setState({changed,data:this.updateData(changed)},this.props.onChangeState(this.updateData(changed))) :
    this.setState({changed,data:this.updateData(changed)});
  }
  isSelected = id => {return this.state.selected.indexOf(id) !== -1;}
  inputFilter=(type,label)=>{ 
    let cols=this.props.data.length > 0 ? Object.keys(this.props.data[0]) : [];
    let labels=typeof this.props.labels !== 'undefined'
     ? this.props.labels.reduce((acc,cur,i)=>{ acc[cols[i]]=cur; return acc },new Object())
     : cols.reduce((acc,cur,i)=>{ acc[cols[i]]=cur; return acc },new Object());
     let begin=typeof this.state.filters[label].begin==='undefined' ? Date.now() : this.state.filters[label].begin;
     let end=typeof this.state.filters[label].end==='undefined' ? Date.now() : this.state.filters[label].end;
    //switch(type) {
      
      if(type.substring(0,6)==='number' || type.substring(0,3)==='int' || type.substring(0,5)==='float'){
        return (<InputLabel>
          <div>
           <TextField required={false} label={`Min ${labels[label]}`} value={typeof this.state.filters[label].min==='undefined' ? '' : this.state.filters[label].min}
            type='number' onChange={e=>this.changeFilter(e,label,'min')} />
           <TextField required={false} label={`Max ${labels[label]}`} value={typeof this.state.filters[label].max==='undefined' ? '' : this.state.filters[label].max}
            type='number' onChange={e=>this.changeFilter(e,label,'max')} />
          </div></InputLabel>);
      }
      else if(type.substring(0,7)==='decimal'){ var step=type.replace(/(decimal\()([0-9]+,)([0-9])(\))/, '$3');
        step=1/Math.pow(10,parseInt(step));
        return (<InputLabel>
          <div>
           <TextField step={step} required={false} label={`Min ${labels[label]}`} value={typeof this.state.filters[label].min==='undefined' ? '' : this.state.filters[label].min}
            type='number' onChange={e=>this.changeFilter(e,label,'min')} />
           <TextField step={step} required={false} label={`Max ${labels[label]}`} value={typeof this.state.filters[label].max==='undefined' ? '' : this.state.filters[label].max}
            type='number' onChange={e=>this.changeFilter(e,label,'max')} />
          </div></InputLabel>);
      }
      else if (type.substring(0,8)==='time'){
        return (<InputLabel>
          <div>
          <TextField required={false} type="time" step={60} label={`Min ${labels[label]}`} value={typeof this.state.filters[label].begin==='undefined' ? '' : this.state.filters[label].begin} type="datetime-local" onChange={e=>this.changeFilter(e,label,'min')} />
          <TextField required={false} type="time" step={60} label={`Max ${labels[label]}`} value={typeof this.state.filters[label].end==='undefined' ? '' : this.state.filters[label].end} type="datetime-local" onChange={e=>this.changeFilter(e,label,'max')} />     
          </div></InputLabel>
        );
      }
      else if (type.substring(0,4) === 'date'){
        return (
          <div>
         {/* <DateRange lang='fr' calendars={1} format={`YYYY-MM-DD`} ranges={{Début:begin,Fin:end}}
          twoStepChange={true} onChange={this.handleRange.bind(this, labels[label])} /> */}
          <TextField type="date" label={`Début ${labels[label]}`} value={begin} onChange={e=>this.changeFilter(e,label,'begin')} />
          <TextField type="date" label={`Fin ${labels[label]}`} value={end} onChange={e=>this.changeFilter(e,label,'end')} />
          </div>
        );
      }
     /* else if(type === 'set'){
        let col = this.props.data.map(line=>line[label]);
        let opt = [...new Set(col)].map(op=>{return {label:op,value:op} });
        let valSet = this.state.filters[label]['in'] ? this.state.filters[label].in.map(e=>{return {label:e,value:e}}) : null;
        let options= [
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' }
        ];
        return(<InputLabel style={{width:'30%'}}>Choisir {label}<Icon>list</Icon>
          <Select isMulti
          autosize
          placeholder="Tous"
          noResultsText="Pas de correspondance"
          options={options}
          //value={valSet}
          //onChange={v=>this.changeSet(v,label)}
        /></InputLabel>)
      }  */
      //if(type.substring(0,7)==='varchar' || type.substring(0,4)==='text'){ 
      else{
        return(<InputLabel>
           <TextField required={false} label={`Filtre ${labels[label]}`} value={typeof this.state.filters[label].val==='undefined' ? '' : this.state.filters[label].val}
            onChange={e=>this.changeFilter(e,label,'val')} />
          </InputLabel>) ;
      }
  }  
  sendLines = (e,s)=>{
    s.fct(this.state.data);
  }
  filterFocus=()=>{ document.getElementsByTagName('input')[0].focus() }
  render() {
    const inv = typeof this.props.invisibles === 'undefined' ? [] : this.props.invisibles;
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page, changed } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const idd = this.props.data.length > 0 ? Object.keys(this.props.data[0])[0] : null;
    let idChanged=changed.map(e=>e[idd]);
    const checkb = this.props.checkb || typeof this.props.checkb==='undefined' ? true : false;
    let filt= typeof this.props.filtre==='undefined' ? {} : this.props.filtre;
    const types=Array.isArray(this.props.types) ? this.props.types : 
    ( typeof data[0] !== 'undefined' ? Object.keys(data[0]).reduce((acc,cur)=>{ return acc.concat('string')},[]) : false);
    return (
      <div style={{overflowX:'scroll'}}>
        <ReactTabToolbar table={this.props.table} numSelected={selected.length} remove={typeof this.props.remove==='function'} fctLines={this.fctLines}
        examines={this.props.examines} update={typeof this.props.update=='function'} removeL={this.removeLine} updateL={this.updateLines}/>
          { Object.keys(filt).length > 0 ? (
            <ExpansionPanel onChange={this.filterFocus}>
                <ExpansionPanelSummary expandIcon={<Tooltip title="Filtrer"><FilterListIcon /></Tooltip>}>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap'}}>
                  { Object.keys(filt).map(f=>{
                     return filt ? this.inputFilter(filt[f],f) : null
                    })
                  }
                  <a href="#" onClick={this.resetFilter}><Icon style={{fontSize:30}} color='error'> autorenew </Icon></a>
                </ExpansionPanelDetails>
            </ExpansionPanel>)
          : false}
        <div>
          <Table id={this.props.idTable || this.props.table} className={classes.table} aria-labelledby="tableTitle">
            <ReactTabHead
              labels={typeof this.props.labels==='undefined' ? (this.props.data.length > 0 ? Object.keys(this.props.data[0]) : []) : this.props.labels}
              cols={this.props.data.length > 0 ? Object.keys(this.props.data[0]) : []}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              update={typeof this.props.update==='function'}
              remove={typeof this.props.remove==='function'}
              examine={this.props.examine}
              checkb={checkb}
              invisibles={inv}
            />
            <TableBody>
              { data.length > 0 ? (
                data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n,m) => {
                  const isSelected = this.isSelected(n[idd]);
                  let inputs=[];
                  typeof this.props.input !== 'undefined' ? inputs=this.props.input.reduce((acc,curr)=>acc.concat(curr.col),[]) : inputs=[];
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={`ligne${m}`}
                      selected={isSelected}
                    > { checkb ? (
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} onClick={event => this.handleClick(event, n[idd])}/>
                      </TableCell>)
                      : false }
                      { Object.keys(n).map((cell,i) => { 
                        if(!inv.includes(cell)){
                         return(                          
                          <TableCell key={`${cell}${m}`} numeric={types[i] === 'number'}>
                           { inputs.indexOf(cell) > -1 ?
                          (<TextField error={idChanged.includes(n[idd])} 
                           style={{width:this.props.input[inputs.indexOf(cell)].type==='string' ? '120px' : '60px'}}
                            value={n[cell]} 
                            type={this.props.input[inputs.indexOf(cell)].type} onChange={e=>this.handleChange(e,cell,n)}/>)  :
                              (types[i] === 'image' ? <Avatar alt={`Image${m}`} src={n[cell]} className={classes.bigAvatar} /> : n[cell])     }
                          </TableCell> 
                          )
                      }
                      })}
                      { typeof this.props.examine!=='undefined' && this.props.examine.length > 0 ?
                        this.props.examine.map((exam,i)=>{
                       return(<TableCell numeric><Avatar><Fab onClick={e=>this.examineLine(n,i,e)}>
                        <Icon color="secondary">{exam.icon}</Icon></Fab></Avatar></TableCell>) })
                      : false}
                    </TableRow>
                  );
                })) : ( <Typography variant='subheading'> Aucune donnée à afficher </Typography> )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={data.length > 0 ? Object.keys(data[0]).length : 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={this.filtredData(data).length}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 100]}
          page={page}
          backIconButtonProps={{ 'aria-label': 'Précédent', }}
          nextIconButtonProps={{ 'aria-label': 'Suivant', }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        /> {/*
        <TableFooter>
              <TableRow>
                <TablePagination
                 rowsPerPageOptions={[5, 10, 25, 100]}
                 colSpan={3}
                 //count={rows.length}
                 rowsPerPage={rowsPerPage}
                 page={page}
                 theme={{direction:'rtl'}}
                 onChangePage={this.handleChangePage}
                 onChangeRowsPerPage={this.handleChangeRowsPerPage}
                 ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter> */}
        { typeof this.props.add !=='undefined' ? <TableCell numeric><a href='#'>
          <Icon className={classes.addButt} color="secondary" onClick={e=>this.addLine(e)}>add_circle</Icon></a></TableCell> : false }
        <div style={{float:'right',width:'50%',display:'flex',flexWrap:'wrap',justifyContent:'space-around'}}>
        { typeof this.props.send !=='undefined' ? (
         this.props.send.map(s=>{ return(
          <Button onClick={e=>this.sendLines(e,s)} color={s.color} className={classes.sendButt} variant="contained">
          {s.label}<Icon>{s.icon}</Icon></Button>) }) )
        : false
        }
        </div>
      </div>
    );
  }
}
ReactTab.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ReactTab);