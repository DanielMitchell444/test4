import logo from './logo.svg';
import styles from '../src/App.module.css'
import SignUp from './Pages/Sigup';
import axios from 'axios';
import { use, useState } from 'react';
import { Link, Route, Router, Routes } from 'react-router-dom';
import {auth, googleProvider, signInWithPopup} from '../src/Services/firebase'
import Login from '../src/Pages/Login'
import Dashboard from './Pages/Dashboard';
import Tracker from './Pages/Tracker';
import Sides from './Pages/Sides';
import PrivateRoute from './Components/PrivateRoute';
import Goals from './Pages/Goals';
import Settings from './Pages/Settings';
import Setup from './Pages/Setup';
function App() {


  const isAuthenticated = !!localStorage.getItem('auth_token');


  const [steps, nextSteps] = useState(1)
  const [meals, setMeals] = useState("")
  const [signUpData, setSignUpData] = useState({
   email: "",
   password: "",
   age: "",
   height: "",
   weight: "",
   firstName: ""
  })





  const [progress, setProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false);

  
  const [toggle, setToggle] = useState(false)

  const [inputChange, handleInputChange] = useState("")


  const [selectedValue, setSelectedValue] = useState("")


  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })

  const [goals, setGoals] = useState({})

  const [errors, setErrors] = useState({})


  const getProgress = () => {
    setProgress(0)
  }


  const handleGoogleSignIn = async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        const response = await fetch("http://localhost:8000/api/auth/token/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        console.log("Backend Response:", data);
        
        if (data.is_first_time_login) {
          // Handle first-time login, e.g., redirect to a setup page or show a welcome message
          window.location.href = "/Setup";
        } else {
          window.location.href = "/Dashboard";  // Normal redirect to the dashboard
        }
    
      } catch (error) {
        console.error("Error signing in with Google:", error);
      }
    };


    const handleSelectedValue = (e) => {
      setSelectedValue(e.target.value)
    }

     const getData = async () => {

    fetch('"https://platform.fatsecret.com/rest/food/autocomplete/v2"')
      .then(response => response.json())
      .then(data => {
        setMeals(data)
      })
  }



    const handleSignIn = async (e) => {
      e.preventDefault()
      if(steps == 1){
        try {
          const response = await axios.post("http://localhost:8000/api/login/", {
            email: loginData.email,
          });

          console.log(response.data)
          nextSteps(step => step + 1)
    
        } catch(error){
          console.log('this did not work', error)
          }

        } else if(steps == 2){
            try {
              const response = await axios.post("http://localhost:8000/api/validate_user/", {
                email: loginData.email,
                password: loginData.password
              });
              const token = response.data.token

              const first_name = response.data.first_name

              const first_time_login = response.data.first_time_login

              if(token && first_time_login == ""){
                localStorage.setItem('auth_token', token)
                localStorage.setItem('first_name', first_name)
                  console.log(response.data)
                  console.log(first_name)
              window.location.href = "/Setup"
              }

              else{
                window.location.href = "/Dashboard"
                localStorage.setItem('first_name', first_name)
              }
        
            } catch(error){
              console.log('this did not work', error)
              }
            }
          }

          const handleLogout = async () => {
            const token = localStorage.getItem('auth_token');  // Get the token from localStorage
        
            if (token) {
              try {
                // Send POST request to the logout endpoint
                const response = await axios.post('http://localhost:8000/api/logout/', {}, {
                  headers: {
                    'Authorization': `Token ${token}`  // Attach the token to the Authorization header
                  }
                });
        
                console.log(response.data);  // Log the response message
        
                // If successful, remove the token from localStorage
                localStorage.removeItem('auth_token');
                localStorage.removeItem('first_name')
        
                // Optionally redirect to the login page
                window.location.href = '/';  // Redirect to login page or any other page
        
              } catch (error) {
                console.log('Error logging out:', error);
              }
            } else {
              console.log('No token found. Already logged out.');
            }
          };
        


          const toggleMenu = () => {
            setMenuOpen((prev) => !prev);
          };
        


    const handleSignUp = async (e) => {
      e.preventDefault();
    
      if (steps === 1) {
        try {
          const response = await axios.post("http://localhost:8000/api/register_email/", {
            email: signUpData.email,
          });
    
          console.log(response.data); // Logs success data
          nextSteps(next => next + 1); // Moves to step 2 (steps will be incremented by 1)
          console.log(steps)
        } catch (error) {
          setErrors(error.response?.data || { general: 'Registration failed' });
          console.log('This did not work!', error);
        }
    
       } else if (steps === 2) {
        try {
          const response = await axios.post("http://localhost:8000/api/register_details/", {
            email: signUpData.email,
            password: signUpData.password,
          });
    
          console.log(response.data); // Logs success data
          nextSteps(steps + 1); // Moves to step 3
          console.log(steps)
        } catch (error) {
          setErrors(error.response?.data || { general: 'Details registration failed' });
          console.log('This does not work', error);
        }
      } else if (steps === 3) {
        try {
          const response = await axios.post("http://localhost:8000/api/register_profile/", {
            email: signUpData.email,
            password: signUpData.password,
            age: signUpData.age,
            weight: signUpData.weight,
            height: signUpData.height,
            gender: signUpData.gender,
            firstName: signUpData.firstName

          });
    
          console.log(response.data); // Logs success data

          window.location.href = "/"
          nextSteps(1)
        } catch (error) {
          setErrors(error.response?.data || { general: 'Details registration failed' });
          console.log('This does not work', error);
          console.log(error.response.data)
        }

      }
    };

  const handleInput = (e) => {
   handleInputChange(e.target.value)
  }
  const handleNext = () => {
    nextSteps(steps + 1)
  }

  const handleBack = () => {
    nextSteps(steps - 1);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
};

const handleClick = async (goals) => {
  setGoals(goals);

  const token = localStorage.getItem('auth_token')

  // Save to Django backend
  try {
    const response = await fetch("http://localhost:8000/api/register_goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        goals: goals ,
      }),
    });

    if (response.ok) {
      console.log("Choice saved successfully!");
      window.location.href = "/Dashboard"
    } else {
      console.error("Error saving choice:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};


const handleProfileChange = (e) => {
  const { name, value } = e.target;
  setSignUpData({ ...signUpData, [name]: value });
}

const handleLoginChange = (e) => {
  const { name, value } = e.target;
  setLoginData({ ...loginData, [name]: value }); // Fix here: use loginData
};

const logout = async () => {
  try {
      const response = await axios.post('http://localhost:8000/api/logout/', {}, {
          headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
          },
      });
      console.log(response.data);
      // Clear token and redirect to login page
      localStorage.removeItem('token');
      window.location.href = '/login';
  } catch (error) {
      console.error("Error logging out:", error.response);
  }
};

  return (
    <div className="App">

<Routes>
      <Route  path = "/" element= {
        <Login
        handleNext={handleNext}
        steps = {steps}
        data = {loginData}
        handleChange = {handleLoginChange}
        handleLogin = {handleSignIn}
        handleGoogleSignIn = {handleGoogleSignIn}
        />
      }

      />

<Route  path = "/SignUp" element= {
          

          <SignUp
          handleNext={handleNext}
          steps = {steps}
          data = {signUpData}
          selectedValue = {selectedValue}
          handleSelectedValue = {handleSelectedValue}
          handleChange = {handleChange}
          handleSignUp = {handleSignUp}
          handleProfileChange = {handleProfileChange}
          handleGoogleSignIn = {handleGoogleSignIn}
          />
      }

      />

  <Route path = "/Settings" element = {
   <PrivateRoute isAuthenticated={isAuthenticated}>
    <Settings
    toggle = {toggle}
    toggleMenu = {toggleMenu}
    menuOpen = {menuOpen}

    />
   </PrivateRoute>

  }

  />

<Route path = "/Dashboard" element = {
  <PrivateRoute isAuthenticated={isAuthenticated}>
  <Dashboard 
  toggle = {toggle}
  toggleMenu = {toggleMenu}
  menuOpen = {menuOpen}
  progress = {progress}
  logout = {handleLogout}


  />

</PrivateRoute>

}

/>

<Route path = "/Tracker" element = {
  <PrivateRoute isAuthenticated={isAuthenticated}>
  <Tracker 
  toggle = {toggle}
  toggleMenu = {toggleMenu}
  menuOpen = {menuOpen}
  getMealData = {getData}
  logout={handleLogout}
  />
  </PrivateRoute>
}

/>

<Route path = '/Sides' element = {
  <Sides />

}

/>

<Route path = "/Goals" element = {
  <PrivateRoute isAuthenticated={isAuthenticated}>
    <Goals
    toggle = {toggle}
    toggleMenu = {toggleMenu}
    menuOpen = {menuOpen}
    logout={handleLogout}
    goals = {goals}
    handleClick={handleClick}
    />
  </PrivateRoute>
}

/>


<Route path = "/Setup" element = {
  <PrivateRoute isAuthenticated= {isAuthenticated}>
    <Setup 
    handleClick = {handleClick}
    />
  </PrivateRoute>
}

/>

      </Routes>
   
    </div>
  );
}

export default App;
