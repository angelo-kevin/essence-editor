import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal/Modal";
import EditRule from '../validationRule/EditRule'
import AddRule from '../validationRule/AddRule'

import axios from 'axios';


const styles = theme => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        width: '100%',
        'min-height': '100vh',
        top: '0',
        overflow: 'hidden'
    },
    colorPrimary: {
        backgroundColor: '#B2DFDB',
    },
    barColorPrimary: {
        backgroundColor: '#00695C',
    },
    paper: {
        overflow: 'scroll',
        height: '80%',
        position: 'absolute',
        width: theme.spacing.unit * 90,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
    },
});

class ManageRule extends Component {

    constructor(props) {
        super(props);

        this.state = {
            openEdit: false,
            openAdd: false,
            rules: [],
        }
    }


    openEdit(rule){
        this.setState({
            openEdit: rule
        })
    }

    closeEdit(){
        this.setState({
            openEdit: false
        })
    }

    openAdd(){
        this.setState({
            openAdd: true
        })
    }

    closeAdd(){
        this.setState({
            openAdd: false
        })
    }


    capitalize(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    componentDidMount(){
        axios.get('http://localhost:8085/rules').then(res => {
            let temp = []
            res.data.map(rule => {
                if (!rule.is_active) rule.color = 'lightgrey'
                temp.push(rule)
            })
            this.setState({
                rules: temp
            })
        })
    }


    render() {
        const { classes }= this.props;
        let idx = 0
        console.log(this.state.rules)
        if (this.state.rules){
            return (
                    <div className={classes.paper}>
                    <text style={{fontSize: "200%"}}>Manage Rule</text>
                    <Button style={{float: 'right'}} variant="contained" color="primary" onClick={this.openAdd.bind(this)}>
                        Add Rule
                    </Button>
                    <br/><br/>
                    <b>Legenda:</b>
                    <br/>
                    <div style={{float: 'left', width: '18px', height: '18px', background: 'lightgrey', marginRight: '5px'}}></div>Aturan validasi tidak aktif
                    <br/>
                    <br/>
                    {this.state.rules.map(rule => 
                        <div style={{backgroundColor: rule.color, marginBottom: "20px", border: '1px solid'}} onClick={this.openEdit.bind(this, rule)}>
                            <text style={{fontSize: "120%"}}>{++idx}. {this.capitalize(rule.name)}</text>
                            <br/>
                            Deskripsi: {this.capitalize(rule.description)}
                            <br/>
                            Kategori: {rule.category}
                            <br/>
                            Tipe: {rule.type}
                        </div>
                    )}

                    <Modal open={this.state.openEdit} onClose={this.closeEdit.bind(this)}>
                        <EditRule rule= {this.state.openEdit} closeForm={this.closeEdit.bind(this)}/>
                    </Modal>

                    <Modal open={this.state.openAdd} onClose={this.closeAdd.bind(this)}>
                        <AddRule closeForm={this.closeAdd.bind(this)}/>
                    </Modal>

                    </div>
            );
        } else{
            return (
                <div> No rules </div>
            )
        }
    }

}


export default withStyles(styles)(ManageRule);
