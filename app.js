// Created by Burey

const API_CORS = "https://cors-anywhere.herokuapp.com";
const API_JOKE = "https://official-joke-api.appspot.com/random_joke";
const API_DAD_JOKE = "https://icanhazdadjoke.com/";

// https://avatars.dicebear.com/
const API_AVATAR = "https://avatars.dicebear.com/v2/:sprite/:seed.svg"
const API_ROBO_HASH = "https://robohash.org/:seed?size=100x100";

const sprites = ["male", "female", "bottts", "avataaars"];

const randSeed = () => Math.random().toString(36).substring(7);

const jokeEPs = [
    {
        ep: API_JOKE,
        mapper: (data) => ({
            type: data.type,
            setup: data.setup,
            punchline: data.punchline,
            avatar: getAvatar()
        })
    },
    {
        ep: API_DAD_JOKE,
        mapper: (data) => ({
            type: "Dad Jokes",
            setup: data.joke,
            avatar: getAvatar()
        })
    }
];

const avatarEPs = [
    API_AVATAR,
    API_ROBO_HASH
];


const getAvatar = () => {
    const api = avatarEPs[Math.floor(Math.random()*avatarEPs.length)];
    const sprite = sprites[Math.floor(Math.random()*sprites.length)];
    const seed = randSeed();
    return api.replace(":sprite", sprite).replace(":seed", seed);
}
    
const headers = {headers:{ "Accept": "application/json"}};

//</script><script type="text/babel">
// credits to @KrOW for finding out how to use JSX in JS tab ^_^

// hide the loader after babel done transpiling the JSX code
document.getElementById("loader").style.display = "none";

// your react code goes below
// get Component from React library (kind of like an import)
const {Component, PureComponent} = React;

class App extends Component {
    // main App component
    constructor(props){
        super(props);
        this.state = {
            jokes: []
        };
        this.getJoke = this.getJoke.bind(this);
        this.remove = this.remove.bind(this);
        
    }
        
    componentDidMount(){
        this.id = 0;
        this.getJoke();
    }
    
    
    /**
    resets the current joke and fetch a new one from tbe API
    */
    getJoke(){
        const api = jokeEPs[Math.floor(Math.random()*jokeEPs.length)];

        axios.get(`${api.ep}`, headers).then((res) => {
            const joke = api.mapper(res.data);
            
            joke.id = this.id++;
            const jokes = this.state.jokes.slice();
            jokes.unshift(joke);
            this.setState({jokes});
        }).catch((err) => {
            console.log(JSON.stringify(err, null, 2));
        });  
    }
    
    remove(id){
        const {jokes} = this.state;
        this.setState({
            jokes: jokes.filter((joke) => joke.id !== id)
        });
    }

    render(){
        const {jokes} = this.state;
        return(
            <div className="app-container">
                <JokeList
                jokes={jokes}
                getJoke={this.getJoke}
                remove={this.remove}
                />
            </div>
        );
    }
}

/**
wrapper for adding animation class to a row after a set amount of time
*/
class AnimatedRow extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            klass:"hidden"
        }
        this.applyShow = this.applyShow.bind(this);
    }
    
    /**
    initiate a timeout call for the applyShow function
    */
    componentDidMount(){
        const {time} = this.props;
        this.timeout = setTimeout(this.applyShow, time*100);
    }
    
    /**
    clear the timeout to prevent memory leaks
    */
    componentWillUnmount(){
        clearTimeout(this.timeout);
    }
    
    /**
    apply the show class to the row, which will let the CSS animate it
    */
    applyShow(){
        this.setState({klass:"show"});
    }
    
    /**
    render the row
    the class name in "klass" will determine if the row should be hidden or animated ro existence
    */
    render(){
        const {klass} = this.state;
        const {children} = this.props;
        
        return(
            <div className={`animated-row ${klass}`}>
                {children}
            </div>
        );
    }
}

/**
stateless JokeList component
*/
const JokeList = (props) => {
    const {jokes, getJoke, remove} = props;
    // console.log(JSON.stringify(joke, null, 2));
    if(!jokes.length){
        //return <Loading />
    }
    
    const jokesList = jokes.map((joke, i) => {
        return(
            <AnimatedRow key={i} time={i}>
                <Joke joke={joke} remove={remove} />
            </AnimatedRow>
        )
    });
    
    return(
        <div className="jokes-list-container">
            <div className="get-joke">
                <button onClick={getJoke}>
                Get New Joke
                </button>
            </div>
            <div>
                {jokesList}
            </div>
        </div>
    );
}

class Joke extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            closed: false
        }
        this.toggle = this.toggle.bind(this);
    }
    
    toggle(){
        const {closed} = this.state;
        this.setState({closed: !closed});
    }
    
    render(){
        const {joke} = this.props;
        const {closed} = this.state;
        return(
            <div className="joke-container">
            
                <div className="joke-controls">
                    <h3 onClick={this.toggle}>
                        {closed? "Open":"Close"}
                    </h3>
                    <button className="remove-joke" onClick={() => this.props.remove(joke.id)}>X</button>
                </div>
                <div className={`joke ${closed? 'closed':''}`}>
                    <div className="avatar">
                        <img src={joke.avatar} />
                    </div>
                    <div className="type">
                        <div>
                        Joke Type: {joke.type}
                        </div>
                    </div>
                    <div className="joke-setup">
                        {joke.setup}
                    </div>
                    <div className="joke-punchline">
                        {joke.punchline}
                    </div>
                </div>
            </div>
        );
    }
}

/**
stateless Loader component
*/
const Loading = () => {
    return(
        <div className="loading fade">
            <h1>Loading...</h1>
        </div>
    );
}

// renders the main react App component
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
//</script>