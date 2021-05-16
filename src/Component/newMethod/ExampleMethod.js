import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import {Grid, MenuItem, Paper, Select, TextField,} from '@material-ui/core';
import Button from "@material-ui/core/Button";

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
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
    },
});
class ExampleMethod extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            author: '',
            intention: [],
            example: ''
        }
    }


    validate () {
        if (this.state.name === '' || this.state.intention === '' || this.state.description === '' || this.state.author === '' || this.state.example === '') {
            alert('All field is required')
        } else {
            let data = JSON.parse(JSON.stringify(this.state))
            data.edge = [];
            data.essence_kernel = [];
            delete data.example
            delete data.value

            axios.post('http://localhost:8085/example/' + this.state.example, data)
                .then( async result => {
                    await this.props.history.push("editor/"+result.data.insertedId);

                }).catch(err => {
                    console.log(err)
            })
        }
    }

    updateState (event) {
        let field = event.target.name;
        this.state[field] = event.target.value
        this.setState({
            value: event.target.value
        })
    }


    closeNewMthod (){
        this.props.cancel()
    }

    render() {
        const { classes }= this.props;
        const intention = this.state.intention
        return (
                <div className={classes.paper}>Clone Method From Provided Examples
                    <br/><br/>
                    <label>Choose Method Example:</label>
                        <Select
                            value={this.state.example}
                            onChange={this.updateState.bind(this)}
                            name="example"
                            label="Method Example"
                            fullWidth>

                            <MenuItem value="6045ac8a2a76be32c0a69e98">Praktik Scrum (Managerial)</MenuItem>
                            <MenuItem value="6045c2b02a76be32c0a69e99">Pengumpulan User Story dan Requirements</MenuItem>
                            <MenuItem value="6045ca2b2a76be32c0a69e9a">Implementasi pada Waterfall</MenuItem>
                        </Select>

                    <TextField id="name"
                               fullWidth
                               label="Method Name"
                               onChange={this.updateState.bind(this)}
                               name="name">
                    </TextField>
                    <br/>
                    <TextField id="description"
                               fullWidth
                               multiline
                               rows={3}
                               label="Method Description"
                               onChange={this.updateState.bind(this)}
                               name="description">
                    </TextField>
                    <br/>
                    {this.state.intention.map((data, index) =>
                        <TextField
                            fullWidth
                            key={index}
                            value={data}
                            label={"Method Intention "+ (index+1) }
                            // onChange={event => this.state.intention[index] = event.target.value }
                            onChange={event => this.setState({
                                intention: [
                                    ...intention.slice(0, index),
                                    event.target.value,
                                    ...intention.slice(index + 1)
                                ]
                            }) }    >
                        </TextField>
                    )}
                    <br/>
                    <br/>

                    <Button variant="outlined" color="primary" onClick={() => this.setState({intention: [...intention, '']})}>
                        Add intention
                    </Button>

                    <br/>
                    <TextField id="author"
                               fullWidth
                               onChange={this.updateState.bind(this)}
                               label="Creator"
                               name="author">
                    </TextField>
                    <br/>
                    <br/>
                    <br/>

                    <Button variant="contained" color="primary" onClick={this.validate.bind(this)}>
                        Clone Example
                    </Button>

                    <Button variant="contained" color="secondary" onClick={this.closeNewMthod.bind(this)}>
                        Cancel
                    </Button>
                </div>

        );
    }
}


export default withStyles(styles)(ExampleMethod);
