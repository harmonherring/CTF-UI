import React from 'react'
import { connect } from 'react-redux'
import { GET } from '../../actions'
import { Bar } from 'react-chartjs-2'
import { Loader } from '../'
import {
    Container,
    Row,
    Col,
    Table,
    Alert
} from 'reactstrap'

class Scoreboard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            showLoader: false,
            scores: [],
            limit: 10,
            error: ""
        }

        this.options = {
            scales: {
                yAxes: [
                    {
                        id: 'Score',
                        yAxisID: 'Score',
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            beginAtZero: true,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Score'
                        }
                    },
                    {
                        id: 'Flags',
                        labelString: 'Flags',
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            beginAtZero: true,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Flags'
                        }
                    }
                ]
            }
        }
    }

    componentDidMount = () => {
        this.getScores()
    }

    initializeLoader = (pauseTime) => {
        this.setState({
            isLoading: true,
            showLoader: false
        })
        setTimeout(() => {
            this.setState({
                showLoader: true
            })
        }, pauseTime)
    }

    getScores = () => {
        this.initializeLoader(1000)
        return GET(this.props.oidc.user.access_token, "/scores?limit=" + this.state.limit)
        .then(response => response.json())
        .then(jsonresponse => this.setState({scores: this.sortByScore(jsonresponse), isLoading: false}))
        .catch(e => this.setState({error: "Unable to fetch scores: " + e, isLoading: false}))
    }

    sortByScore = (scoresObj) => {
        return Object.keys(scoresObj)
        .sort(function(a,b) {return scoresObj[b].score - scoresObj[a].score})
        .map(key => {return {...scoresObj[key], username: key}})
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Loader loading={this.state.showLoader} />
            )
        } else {
            return (
                <Container>
                    { this.state.error && <Alert color="danger">{this.state.error}</Alert>}
                    <Row style={{"marginBottom": "40px"}}>
                        <Col sm='12'>
                            <Bar data={{
                                labels: this.state.scores.slice(0, 10).map(key => key.username),
                                datasets: [
                                    {
                                        label: 'Score',
                                        backgroundColor: 'rgb(176, 25, 126)',
                                        yAxisID: 'Score',
                                        data: this.state.scores.slice(0, 10).map(key => key.score)
                                    },
                                    {
                                        label: 'Flags',
                                        backgroundColor: 'rgb(225, 28, 82)',
                                        yAxisID: 'Flags',
                                        data: this.state.scores.slice(0, 10).map(key => key.solved_flags)
                                    }
                                ]
                            }} options={this.options} />
                        </Col>
                    </Row>
                    <Row style={{"marginBottom": "40px"}}>
                        <Col sm='12'>
                            <Table responsive striped>
                                <thead>
                                    <tr>
                                        <th>Place</th>
                                        <th>Username</th>
                                        <th>Score</th>
                                        <th>Flags</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.scores.map((value, index) => 
                                            <tr key={value.username}>
                                                <th>{index + 1}</th>
                                                <th>{value.username}</th>
                                                <td>{value.score}</td>
                                                <td>{value.solved_flags}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}

const mapStateToProps = state => ({
    oidc: state.oidc
})

export default connect(
    mapStateToProps
)(Scoreboard)
