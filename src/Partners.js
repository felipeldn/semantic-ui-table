import React, { Component } from 'react'
import { Table, Image, Input } from 'semantic-ui-react'

export default class Partners extends Component {

    constructor(props) {
        super(props)

        this.state = {
            error: null, 
            isLoaded: false,
            colleges: [],
            searchByName: "",
            searchByPrefix: "",
            currentSort: 'default'
        };

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({
            searchByName: event.target.value,
            searchByPrefix: event.target.value,
        })
    }

    componentDidMount() {
        fetch(`https://mindfuleducation-cdn.s3.eu-west-1.amazonaws.com/misc/data.json`)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    colleges: result.getColleges,
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    renderRow(college) {

        return (
            <Table.Row key={college.id}>
                <Table.Cell>{college.name}</Table.Cell>
                <Table.Cell>{college.groupPrefix}</Table.Cell>
                <Table.Cell>
                    <Image src={college.logo} size="small" centered/>
                </Table.Cell>
                <Table.Cell>{college.ofstedRating}</Table.Cell>
            </Table.Row>
        )
    }

    render() {

        // const {colleges} = this.state
        
        const filterColleges = (colleges, query) => {
            if(!query) {
                return colleges;
            }

            return colleges.filter((college) => {
                const collegeName = college.name.toLowerCase();
                const collegePrefix = college.groupPrefix.toLowerCase();
                return collegeName.includes(query) || collegePrefix.includes(query)
            })
        };
        
        const filteredColleges = filterColleges(
            this.state.colleges,
            this.state.searchByName,
            this.state.searchByPrefix
        );

        const sortTypes = {
            up: {
                class: 'sort-up',
                fn: (a, b) => a.name > b.name ? -1 : 1
            },
            down: {
                class: 'sort-down',
                fn: (a, b) => a.name < b.name ? -1 : 1
            },
            default: {
                class: 'default',
                fn: (a, b) => 0
            }
        };

        const onSortChange = () => {
            const { currentSort } = this.state;
            let nextSort;

            if (currentSort === 'down') nextSort = 'up';
            else if (currentSort === 'up') nextSort = 'down';
            else if (currentSort === 'default') nextSort = 'down';

            this.setState({ 
                currentSort: nextSort
            });
        }

        const { currentSort } = this.state
        // console.log(currentSort)
        return(
            <div>
                <Input
                    type="text"
                    placeholder="Search partners"
                    onChange={this.handleChange}
                />
                <Input
                    type="text"
                    placeholder="Search prefix"
                    onChange={this.handleChange}
                />

                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell onClick={onSortChange}>
                                <i className={`fas fa-${sortTypes[currentSort].class}`}/>Name
                            </Table.HeaderCell>
                            <Table.HeaderCell>Prefix</Table.HeaderCell>
                            <Table.HeaderCell>Logo/Preroll</Table.HeaderCell>
                            <Table.HeaderCell>Ofsted Rating</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                        <Table.Body>
                            {[...filteredColleges].sort(sortTypes[currentSort].fn).map(college => this.renderRow(college))}
                        </Table.Body>
                </Table>
            </div>
            
        )
    }

}

