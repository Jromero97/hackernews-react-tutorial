import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';


// const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

    onDismiss(id) {
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];

        const isNotId = item => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);
        this.setState(
            {
                results: { ...results, [searchKey]: { hits: updatedHits, page } }
            }
        );
    }

    onSearchChange(event) {
        this.setState({
            searchTerm: event.target.value
        });
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        const searchTermParam = searchTerm || DEFAULT_QUERY;
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
    }

    onSearchSubmit(event) {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm});
        this.fetchSearchTopStories(searchTerm);
        event.preventDefault();
    }

    // Component constructor
    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);

    }

    setSearchTopStories(result) {
        const { hits, page } = result;
        const { searchKey, results } = this.state;

        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

        const updatedHits = [ ...oldHits, ...hits];

        this.setState({
            results: { ...results, [searchKey]: { hits: updatedHits, page }}
        })
    }

    componentDidMount() {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm});
        this.fetchSearchTopStories(searchTerm);
    }

    // Render function of component
    render() {
        const { searchTerm, results, searchKey} = this.state;
        const page = (results && results[searchKey] && results[searchKey].page) || 0;
        const list = (results && results[searchKey] && results[searchKey].hits) || [];

        return (
            <div className="page">
                <div className="interactions">
                    <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
                        Search
                    </Search>
                </div>
                <Table list={list} onDismiss={this.onDismiss}/> }
                <div className="interactions">
                    <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                        More
                    </Button>
                </div>
            </div>
        );
    }
}

function Search({ value, onChange, onSubmit, children }) {
        return (
            <form>
                <input type="text" value={value} onChange={onChange}/>
                <button type="submit">
                    {children}
                </button>
            </form>
        )
}

function Table({ list, onDismiss }) {
        const largeColumn = {
            width: '40%',
        };

        const midColumn = {
            width: '30%',
        };

        const smallColumn = {
            width: '10%',
        };

        return (
            <div className="table">
                {list.map(item =>
                <div key={item.objectID} className="table-row">
                    <span style={largeColumn}>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span style={midColumn}>{item.author}</span>
                    <span style={smallColumn}>{item.num_comments}</span>
                    <span style={smallColumn}>{item.points}</span>
                    <span style={smallColumn}>
                        <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
                            Dismiss
                        </Button>
                    </span>
                </div>)}
            </div>
        )
}

function Button({ onClick, className = '', children }) {
        return (
            <button onClick={onClick} className={className} type="button">
                {children}
            </button>
        )
}

export default App;
