import React from 'react';
import './Register.css';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      namePlaceHolder: 'Please type your username...',
      emailPlaceHolder: 'Please type your email...',
      passPlaceHolder: 'Please type your password...',
      passAvailable: true,
    }
  }

  onUsernameChange = async (event) => {
    // const value = event.target.value;
    // if (!value) this.setState({nameAvailable: true});
    // else if (value.length && !value.length > 2) this.setState({nameAvailable: false});
    // else {
    //   const res = await fetch('http://localhost:5000/verify', {
    //     method: 'post',
    //     headers: {'content-Type': 'application/json'},
    //     body: JSON.stringify({
    //       username: this.username,
    //     })
    //   });

    //   if (!res.status === 200) this.setState({nameAvailable: false});
    //   else this.setState({nameAvailable: true});
    // }

    this.setState({username: event.target.value});
  }

  onEmailChange = async (event) => {
    // const value = event.target.value;
    // if (!value) this.setState({emailAvailable: true});
    // else if (value.length && !value.length > 2) this.setState({emailAvailable: false});
    // else {
    //   const res = await fetch('http://localhost:5000/verify', {
    //     method: 'post',
    //     headers: {'content-Type': 'application/json'},
    //     body: JSON.stringify({
    //       email: this.email,
    //     })
    //   });

    //   if (!res.status === 200) this.setState({emailAvailable: false});
    //   else this.setState({emailAvailable: true});
    // }

    this.setState({email: event.target.value});
  }

  onPasswordChange = (event) => {
    const value = event.target.value;
    if (value.length > 6) this.setState({passAvailable: true});
    else this.setState({passAvailable: false});

    if (!value) this.setState({passAvailable: true});
    else if (value && value.length)
    this.setState({password: event.target.value});
  }

  onSubmitRegister = async () => {
    if (!(this.state.emailAvailable || this.state.nameAvailable)) return;

    const res = await fetch('http://localhost:5000/register', {
      method: 'post',
      headers: {'content-Type': 'application/json'},
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
      })
    });

    const status = res.status;
    if (status === 200){
      const user = await res.json();
      this.props.loadUser(user);
      this.props.onRouteChange('home');
    }
  }


  render() {
  
    return (
      <article  className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 center shadow-5">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph1 mh1">
              <legend className="f2 fw7 ph1 mh1">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                <input  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="name"  id="name" placeholder={this.state.namePlaceHolder} onChange={this.onUsernameChange}/>
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" placeholder={this.state.emailPlaceHolder} onChange={this.onEmailChange}/>
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" placeholder={this.state.passPlaceHolder} onChange={this.onPasswordChange}/>
              </div>
            </fieldset>
            <div>
              <input onClick={this.onSubmitRegister} className="b ph4 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register" />
            </div>
            {
              ( this.state.emailAvailable || this.state.nameAvailable || this.state.passAvailable ) ? '' :
              <div className="mv3">
                {
                  !this.state.passAvailable? 
                  <div>
                    <ul>
                      <li className='err'><h6>Password should be minimum of 6 characters or maximum of 12 characters.</h6></li>
                      <li className='err'><h6>Password should contain a number.</h6></li>
                      <li className='err'><h6>Password should contain a special character $ % * ...</h6></li>
                      <li className='err'><h6>Password should contain a capital letter.</h6></li>
                      <li className='err'><h6>Password should contain a small letter.</h6></li>
                    </ul>
                  </div>
                  : ''
                }
              </div>
            }
          </div>
        </main>
      </article>
    );
  }
  }
  
  export default Register; 