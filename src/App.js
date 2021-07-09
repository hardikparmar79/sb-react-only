import React,{ Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import  Navigation from './component/navigation/Navigation.js';
import Logo from './component/logo/Logo.js';
import ImageLinkForm from './component/imageLinkForm/ImageLinkForm.js';
import Rank from './component/Rank/Rank.js';
import FaceRecognition from './component/FaceRecognition/FaceRecognition.js';
// import Register from './component/Register/Register.js';
// import Signin from './component/Signin/Signin.js';
import Particles from 'react-particles-js';


const app = new Clarifai.App({
  apiKey: 'd9a9b56d51c04707be4899df2476aab8'
  });

const particlesOptions = {
           particles : {
           number: {
           value:100,
           density: {
            enable: true,
            value_area:500
           }
         }
       }
     }

class App extends Component{
  constructor(){
    super()
    this.state = {
      input: 'onInputChange',
      imageUrl: '',
      box: {},
      route:'Register',
      isSignedIn:false,
      user: {
          id: '',
          name:'',
          email: '',
          entries:'',
          joined: ''
      }
    }
  }
   loadUser = (data) => {
    this.setState({
      user : {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
     }
    })
   }

  calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputimage');
   const width= Number(image.width);
   const height= Number(image.height);
   return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
   }
  }
  displayFaceBox = (box) => {
    this.setState({box: box});
  }
  onInputChange = (event) => {
     this.setState({input: event.target.value})
  }
  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});

    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input )
    .then(response => {
      if(response){
        fetch('http://localhost:3000/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          id: this.state.user.id
          }) 
         })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log (err));
  }
  onRouteChange = (route) => {
    if( route=== 'signout' ){
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({ route: route });
  }
  render(){
    const {isSignedIn, imageUrl, box, route} = this.state;
    return (
      <div className="App">          
            <Particles className='particles'params= {particlesOptions}/>
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
             
            <div>
            <Logo/>
            
            <ImageLinkForm
             onInputChange= {this.onInputChange}
             onButtonSubmit = {this.onButtonSubmit}
            />
            <FaceRecognition box = {box} imageUrl= {imageUrl}/>
            </div>
            
            
            )
          }
          </div>
   );
  }
}

export default App;
