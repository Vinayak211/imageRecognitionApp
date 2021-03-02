import './App.css';
import Navigation from './Components/Navigation/Navigation';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import Logo from './Components/Logo/Logo';
import { Component } from 'react';
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';

const app = new Clarifai.App({apiKey: '54236f22234e4a42a1e7f22ce42f11de'});

const particlesOptions = {
  particles: {
    number: {
      value: 50, 
      density: {
        enable: true,
        value_area: 250
      }
    },
    size: {
      value: 3
    }
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      }
    }
  }

}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {},
    }
  }

  loadUser = (user) => {
    this.setState({user});
  }

  calculateFaceLocation = (data) => {
    const calrifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: calrifaiFace.left_col * width,
      topRow: calrifaiFace.top_row * height,
      rightCol: width - (calrifaiFace.right_col * width),
      bottomRow: height - (calrifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = async () => {
    try {
      this.setState({imageUrl: this.state.input});
      const response = await app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input);
        if (response) {
          const resp = await fetch('http://localhost:5000/image', {
            method: 'put',
            headers: {'content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id,
              image: this.state.imageUrl,
            })
          });

          if (resp.status === 200) {
            if (!this.state.user.images.includes(this.state.imageUrl)) {
              this.state.user.images.push(this.state.imageUrl);
              this.state.user.entries += 1;
            }
          }
          this.displayFaceBox(this.calculateFaceLocation(response));
        }
    } catch (error) {
      console.log(error);
    }
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route})
  }

  render() {
    const { isSignedIn, imageUrl, box, route } = this.state;
    return (
    <div className="App">
    <Particles className='Particles' params={particlesOptions} />
    <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
    { route === 'register' ? 
    <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> :
    route === 'signin' ?
    <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> :
    route === 'home' ?
    <div> 
    <Logo />
    <Rank user={this.state.user}/>
    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
    <FaceRecognition box={box} imageUrl={imageUrl}/>
    </div>
    : 
    <p> Something went wrong</p>
    }
    </div>
  );
}
}

export default App;