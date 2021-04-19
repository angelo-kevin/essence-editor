import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import {Grid, Paper, TextField,} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
        width: theme.spacing.unit * 70,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
    },
});

class AddRule extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rule: {}
        }
    }


    capitalize(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    updateRule (event) {
        let field = event.target.name;
        this.state.rule[field] = event.target.value
        this.setState({
            value: event.target.value
        })
    }


    saveRule(){
        if (Object.keys(this.state.rule).length != 7){
            alert("All fields required!")
        } else {
            axios.post('http://localhost:8085/rules', this.state.rule).then(res => {
                console.log(res)
                alert("Rule added")
            }).catch(err => {
                console.log(err)
            })
        }
    }


    componentDidMount(){
    }


    render() {
        const { classes }= this.props;
        let rule = this.state.rule
        return (
                <div className={classes.paper}>
                    <text style={{fontSize: "200%"}}>Add Rule</text>
                <br/>
                <br/>

                <div>
                    <TextField id="name"
                        fullWidth
                        label="Rule Name"
                        onChange={this.updateRule.bind(this)}
                        name="name">
                    </TextField>

                    <br/><br/>
                    <TextField id="description"
                        fullWidth
                        label="Rule Description"
                        onChange={this.updateRule.bind(this)}
                        name="description">
                    </TextField>

                    <br/><br/>
                    <label>Rule Category:</label>
                        <Select
                            value={rule.category}
                            onChange={this.updateRule.bind(this)}
                            name="category"
                            label="Rule Category"
                            fullWidth>

                            <MenuItem value="correctness">correctness</MenuItem>
                            <MenuItem value="completeness">completeness</MenuItem>
                        </Select>
                    
                    <br/><br/>
                    <label>Rule Type:</label>
                        <Select
                            value={rule.type}
                            onChange={this.updateRule.bind(this)}
                            name="type"
                            label="Rule Type"
                            fullWidth>

                            <MenuItem value="element_count">element_count</MenuItem>
                            <MenuItem value="connectivity">connectivity</MenuItem>
                            <MenuItem value="properties">properties</MenuItem>
                        </Select>

                    <br/><br/>
                    <TextField id="filter"
                        fullWidth
                        label="Rule Filter"
                        onChange={this.updateRule.bind(this)}
                        name="filter">
                    </TextField>

                    <br/><br/>
                    <TextField id="rule"
                        fullWidth
                        label="Rule"
                        onChange={this.updateRule.bind(this)}
                        name="rule">
                    </TextField>

                    <br/><br/>
                    <label>Rule Active?</label>
                        <Select
                            value={rule.is_active}
                            onChange={this.updateRule.bind(this)}
                            name="is_active"
                            label="Rule Active?"
                            fullWidth>

                            <MenuItem value={true}>true</MenuItem>
                            <MenuItem value={false}>false</MenuItem>
                        </Select>
                </div>

                <br/>
                <br/>

                <Button variant="contained" color="primary" onClick={this.saveRule.bind(this)}>
                    Save
                </Button>

                </div>
        )
    }
}


export default withStyles(styles)(AddRule);
