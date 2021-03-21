import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import {Grid, Paper, TextField,} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import { Redirect } from 'react-router-dom';
import { useAlert } from 'react-alert'

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

class ValidateDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rules: [],
            kernel: this.convertKernel(this.props.kernel),
            edge: this.convertEdge(this.props.edge)
        }
    }


    capitalize(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    convertEdge(edge){
        let data = []

        edge.forEach(e => {
            if (e.source && e.target){
                data.push({
                    source: {
                        id: e.source.id,
                        name: e.source.value,
                        type: e.source.detail.type
                    },
                    target: {
                        id: e.target.id,
                        name: e.target.value,
                        type: e.target.detail.type
                    }
                })
            }
        })

        return data
    }


    convertKernel(essence) {
        var data_json_dynamic = {
            "activitySpace" : [],
            "alpha": [],
            "competency": [],
            "activity" : [],
            "workProduct" : []
        };

        var alpha = essence.filter(function (kernel) {
            return kernel.detail.type === 'Alpha'
        })

        for (var i = 0 ; i < alpha.length ; i++) {
            let data = {
                id : alpha[i].id,
                name : alpha[i].value,
                workProduct : [],
                state : [],
                subAlpha : []
            }

            let alpha_detail = alpha[i].detail

            for (var j = 0 ; j < alpha_detail.workProduct.length ; j++) {
                let workProductData = {
                    id : alpha_detail.workProduct[j].id,
                    name : alpha_detail.workProduct[j].value,
                    levelDetail : alpha_detail.workProduct[j].detail.level_of_detail,
                }

                data.workProduct.push(workProductData)
            }

            for (var j = 0 ; j < alpha_detail.state.length ; j++) {
                let state = {
                    name : alpha_detail.state[j].name,
                    checklist : alpha_detail.state[j].checkList,
                }

                data.state.push(state)
            }

            for (var j = 0 ; j < alpha_detail.subAlpha.length ; j++) {
                let subAlpha = {
                    id : alpha_detail.subAlpha[j].id,
                    name : alpha_detail.subAlpha[j].value,
                    workProduct : [],
                    state : [],
                }

                let subAlpha_detail = alpha_detail.subAlpha[j].detail

                for (var k = 0 ; k < subAlpha_detail.workProduct.length ; k++) {
                    let workProductData = {
                        id: subAlpha_detail.workProduct[k].id,
                        name : subAlpha_detail.workProduct[k].value,
                        levelDetail : subAlpha_detail.workProduct[k].detail.level_of_detail,
                    }

                    subAlpha.workProduct.push(workProductData)
                }

                for (var k = 0 ; k < subAlpha_detail.state.length ; k++) {
                    let state = {
                        name : subAlpha_detail.state[k].name,
                        checklist : subAlpha_detail.state[k].checkList,
                    }

                    subAlpha.state.push(state)

                }

                data.subAlpha.push(subAlpha)
            }

            data_json_dynamic.alpha.push(data)
        }

        var activitySpace = essence.filter(function (kernel) {
            return kernel.detail.type === 'ActivitySpace'
        })

        for (var i = 0 ; i < activitySpace.length ; i++) {
            let data = {
                id : activitySpace[i].id,
                name : activitySpace[i].value,
                activity : [],
            }

            var detail = activitySpace[i].detail

            for (var j = 0 ; j < detail.activity.length; j ++ ) {
                let activity = {
                    id : detail.activity[j].id,
                    name : detail.activity[j].value,
                    completionCriterion : {
                        alphas : [],
                        workProduct : []
                    },
                    entryCriterion : {
                        alphas : [],
                        workProduct : []
                    },
                    competency: detail.activity[j].detail.competency
                }

                let act_detail = detail.activity[j].detail;

                for (var k = 0 ; k < act_detail.entryCriterion.alphas.length; k++) {
                    activity.entryCriterion.alphas.push(act_detail.entryCriterion.alphas[k].value)
                }

                for (var k = 0 ; k < act_detail.entryCriterion.workProduct.length; k++) {
                    activity.entryCriterion.workProduct.push(act_detail.entryCriterion.workProduct[k].value)
                }

                for (var k = 0 ; k < act_detail.completionCriterion.alphas.length; k++) {
                    activity.completionCriterion.alphas.push(act_detail.completionCriterion.alphas[k].value)
                }

                for (var k = 0 ; k < act_detail.completionCriterion.workProduct.length; k++) {
                    activity.completionCriterion.workProduct.push(act_detail.completionCriterion.workProduct[k].value)
                }

                data.activity.push(activity)
            }

            data_json_dynamic.activitySpace.push(data)
        }

        var competency = essence.filter(function (kernel) {
            return kernel.detail.type === 'Competency'
        })

        for (var i = 0 ; i < competency.length ; i++) {
            let data = {
                id : competency[i].id,
                name : competency[i].value,
                level : [],
            }

            if (competency[i].detail.level.Assists) data.level.push("Assists")
            if (competency[i].detail.level.Applies) data.level.push("Applies")
            if (competency[i].detail.level.Masters) data.level.push("Masters")
            if (competency[i].detail.level.Adapt) data.level.push("Adapt")
            if (competency[i].detail.level.Innovates) data.level.push("Innovates")
            data_json_dynamic.competency.push(data)
        }

        var activity = essence.filter(function (kernel) {
            return kernel.detail.type === 'Activity'
        })

        for (var i = 0 ; i < activity.length ; i++) {
            let data = {
                id : activity[i].id,
                name : activity[i].value
            }

            data_json_dynamic.activity.push(data)
        }

        var workProduct = essence.filter(function (kernel) {
            return kernel.detail.type === 'WorkProduct'
        })

        for (var i = 0 ; i < workProduct.length ; i++) {
            let data = {
                id : workProduct[i].id,
                name : workProduct[i].value,
                levelDetail : workProduct[i].detail.level_of_detail
            }

            data_json_dynamic.workProduct.push(data)
        }

        return data_json_dynamic;
    }


    gatherKernel(data, graph){
        let filter = data.split('=')[0]
        let value = data.split('=')[1]
        let arr = []

        if (filter === "TYPE"){
            graph[value].forEach(el => {
                arr.push(el.id)
            })

        } else if (filter === "NAME"){
            for (let i in graph){
                let filtered = graph[i].filter(kernel => {
                    return kernel.name === value
                })

                if (filtered.length) filtered.forEach(el => arr.push(el.id))
            }

        } else if (filter === "ID"){
            for (let i in graph){
                let filtered = graph[i].filter(kernel => {
                    return kernel.id === value
                })

                if (filtered.length) filtered.forEach(el => arr.push(el.id))
            }
        }

        return arr
    }


    validateCategory(data){
        let table = {
            "element_count": ["MINCOUNT", "MAXCOUNT", "EQUALCOUNT"],
            "connectivity": ["ORDER", "DISJOINT", "HASRELATION"],
            "properties": ["MINPROPCOUNT", "MAXPROPCOUNT", "EQUALPROPCOUNT"]
        }

        let valid = true

        let operator = data.rule.split('=')[0]
        let filter = data.filter.split('=')[0]

        if (data.category === "connectivity"){
            valid = (filter === "AND") || data.filter === "TYPE=all"
        }

        if (filter === "AND" && data.category !== "connectivity"){
            valid = false
        }

        return (data.category in table) && table[data.category].includes(operator) && valid
    }


    validateRule(data){
        let graph = this.state.kernel

        if (data.category === "element_count"){
            let count = 0
            let filter = data.filter.split('=')[0]
            let value = data.filter.split('=')[1]
            
            if (filter === "TYPE"){
                count = graph[value].length

            } else if (filter === "NAME"){
                let len = 0
                for (let i in graph){
                    len += graph[i].filter(kernel => kernel.name === value).length
                }
                count = len

            } else if (filter === "ID"){
                let len = 0
                for (let i in graph){
                    len += graph[i].filter(kernel => kernel.id === value).length
                }
                count = len
            }

            let op = data.rule.split('COUNT=')[0]
            let num = parseInt(data.rule.split('COUNT=')[1])

            switch(op){
                case 'MAX':
                    return count <= num
                case 'MIN':
                    return count >= num
                case 'EQUAL':
                    return count === num
            }

        } else if (data.category === "properties"){
            let count = []
            let filter = data.filter.split('=')[0]
            let value = data.filter.split('=')[1]

            let right = data.rule.split('PROPCOUNT=')[1]
            let prop = right.split(',')[0]
            
            if (filter === "TYPE"){
                let arr = graph[value]
                if (prop === "checklist"){
                    arr.forEach(el => {
                        let temp = 0
                        el.state.forEach(elem => {
                            temp += elem.checklist.length
                        })
                        count.push(temp)
                    })
                } else{
                    arr.forEach(el => {
                        count.push(el[prop].length)
                    })
                }

            } else if (filter === "NAME"){
                let arr = []
                for (let i in graph){
                    let filtered = graph[i].filter(kernel => {
                        return kernel.name === value
                    })

                    if (filtered.length) filtered.forEach(el => arr.push(el))
                }

                if (prop === "checklist"){
                    arr.forEach(el => {
                        let temp = 0
                        el.state.forEach(elem => {
                            temp += elem.checklist.length
                        })
                        count.push(temp)
                    })
                } else{
                    arr.forEach(el => {
                        count.push(el[prop].length)
                    })
                }

            } else if (filter === "ID"){
                let arr = []
                for (let i in graph){
                    let filtered = graph[i].filter(kernel => {
                        return kernel.id === value
                    })

                    if (filtered.length) filtered.forEach(el => arr.push(el))
                }

                if (prop === "checklist"){
                    arr.forEach(el => {
                        let temp = 0
                        el.state.forEach(elem => {
                            temp += elem.checklist.length
                        })
                        count.push(temp)
                    })
                } else{
                    arr.forEach(el => {
                        count.push(el[prop].length)
                    })
                }
            }

            let op = data.rule.split('PROPCOUNT=')[0]
            let num = parseInt(right.split(',')[1])

            if (!count.length) return 2
            
            let valid = true

            switch(op){
                case 'MAX':
                    count.forEach(el => {
                        if (el > num) valid = false
                    })
                    break
                case 'MIN':
                    count.forEach(el => {
                        if (el < num) valid = false
                    })
                    break
                case 'EQUAL':
                    count.forEach(el => {
                        if (el !== num) valid = false
                    })
                    break
                default:
                    valid = 3
            }

            return valid

        } else if (data.category === "connectivity"){
            let edge = this.state.edge

            if (data.filter === "TYPE=all" && data.rule === "HASRELATION"){
                let ids = []

                for (let i in graph){
                    graph[i].forEach(el => {
                        ids.push(el.id)
                    })
                }

                for (let el in edge){
                    let i = ids.indexOf(edge[el].source.id)
                    if (i > -1) ids.splice(i, 1)

                    i = ids.indexOf(edge[el].target.id)
                    if (i > -1) ids.splice(i, 1)

                    if (!ids.length) return true
                }

                return false
            }

            let filter = data.filter.split('=')[0]
            
            if (filter !== "AND") return 3

            let left = data.filter.split("AND=")[1].split(',')[0]
            let right = data.filter.split("AND=")[1].split(',')[1]
            
            let leftarr = this.gatherKernel(left, graph)
            let rightarr = this.gatherKernel(right, graph)

            let valid = true
            
            switch(data.rule){
                case "HASRELATION":
                    console.log(leftarr, rightarr)
                    for (let i in leftarr){
                        for (let j in rightarr){
                            let temp = edge.filter(el => {
                                return (el.source.id === leftarr[i] && el.target.id === rightarr[j])
                                || (el.source.id === rightarr[j] && el.target.id === leftarr[i])
                            })

                            if (temp.length) break

                            if (j == rightarr.length - 1) valid = false
                        }
                        if (!valid) break
                    }
                    break

                case "DISJOINT":
                    for (let i in leftarr){
                        for (let j in rightarr){
                            let temp = edge.filter(el => {
                                return (el.source.id === leftarr[i] && el.target.id === rightarr[j])
                                || (el.source.id === rightarr[j] && el.target.id === leftarr[i])
                            })
                            
                            if (temp.length) valid = false

                            if (!valid) break
                        }
                        if (!valid) break
                    }
                    break

                case "ORDER":
                    for (let i in leftarr){
                        for (let j in rightarr){
                            let temp = edge.filter(el => {
                                return (el.source.id === leftarr[i] && el.target.id === rightarr[j])
                            })
                            
                            if (!temp.length) valid = 2

                            let tempp = edge.filter(el => {
                                return (el.source.id === rightarr[j] && el.target.id === leftarr[i])
                            })

                            if (tempp.length) valid = false

                            if (!valid) break
                        }
                        if (!valid) break
                    }
                    break

                default:
                    valid = 3
            }

            return valid
        }
    }


    validate(data){
        data.forEach(e => {
            if (!this.validateCategory(e)){
                e.color = "yellow"
            } else{
                let bool = this.validateRule(e)
                switch(bool){
                    case false:
                        e.color = "red"
                        break
                    case true:
                        e.color = "lightgreen"
                        break
                    case 2:
                        e.color = "lightblue"
                        break
                    default:
                        e.color = "yellow"
                }
            }
        });
        this.setState({
            rules: data
        })
    }


    componentDidMount(){
        axios.get('http://localhost:8085/rules').then(res => {
            let rules = [];
            res.data.map(rule => {
                if (rule.is_active) rules.push(rule)
            })
            this.validate(rules)
        })
    }


    render() {
        const { classes }= this.props;
        if (this.state.rules){
            return (
                    <div className={classes.paper}>
                        <text style={{fontSize: "200%"}}>Method Validation</text>
                    <br/>
                    <br/>
                    {this.state.rules.map(rule => 
                        <div style={{backgroundColor: rule.color, marginBottom: "20px"}}>
                            <text style={{fontSize: "120%"}}>{rule.id}. {this.capitalize(rule.name)}</text>
                            <br/>
                            Deskripsi: {this.capitalize(rule.description)}
                            <br/>
                            Kategori: {rule.category}
                        </div>
                    )}

                    </div>
            );
        } else{
            return (
                <div> No rules </div>
            )
        }
    }

}


export default withStyles(styles)(ValidateDetail);
