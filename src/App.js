import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import "./App.css";
import { useState } from 'react';
import Orders from "./components/Orders";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from '../src/axios';
import { useNavigate } from "react-router-dom";


function App() {
  const [authorizedUser, setAuthorizedUser] = useState(false || sessionStorage.getItem("accessToken") || sessionStorage.getItem("jwttoken"));
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  const auth = getAuth();


  const SignUp = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleSignUp = async (e) => {
      e.preventDefault();
      try {
        await axios.post('/add-user', {
          name, phoneNumber, password
        }).then((res) => {
          alert(res.data.message);
          navigate("/");
        }

        )
      } catch (error) {
        alert('Something went wrong');
      }
    };

    return (

      <div class="login-wrap">
        <h2>SignUp</h2>
        <div class="form">
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)} placeholder="Name" name="un"
            />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" name="un"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" name="pw"
            />
            <button type="submit" >Register</button>
          </form>
          <h3 class="hr-lines"> OR </h3>
          <span class="signup-link"   > Have an Account? <a><Link to="/">Login</Link></a></span>
        </div>
      </div>
    );
  }

  const Login = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function normallogin(e) {
      e.preventDefault();
      const loginby = "normal";
      try {
        await axios.post('/login-user', {
          phoneNumber, password, loginby
        }).then((res) => {
          if (!res.data.error) {
            setAuthorizedUser(true);
            sessionStorage.setItem("jwttoken", res.data.token);
            sessionStorage.setItem("tokentype", "jwt");
            sessionStorage.setItem("userid", res.data.userid);
            navigate("/order");
          }
          else {
            alert(res.data.error);
          }
        })
      } catch (error) {
      }
    }

    async function signInwithGoogle() {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          if (user) {
            user.getIdToken().then((tkn) => {
              sessionStorage.setItem("accessToken", tkn);
              setAuthorizedUser(true);
              const loginby = "google";
              try {
                axios.post('/login-user', {
                  user, loginby
                }).then(res => {
                  if (!res.data.error) {
                    sessionStorage.setItem("userid", res.data.userid);
                    sessionStorage.setItem("tokentype", "google");
                    navigate("/order");
                  } else {
                    alert(res.data.error);
                  }
                });
              } catch (error) {
              }
            })
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
        });
    }


    return (

      <div class="login-wrap">
        <h2>Login</h2>
        <div class="form">
          <form onSubmit={normallogin}>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" name="un"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" name="pw"
            />
            <button type="submit" >Login</button>
          </form>
          <h3 class="hr-lines"> OR </h3>
          <button class="google" onClick={signInwithGoogle}>Login with Google</button>
          <span class="signup-link"   >Don't have an account? <a><Link to="/adduser">Register</Link></a></span>
        </div>
      </div>
    )
  }

  const Order = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subtotal, setSubTotal] = useState('');
    const navigate = useNavigate();
    async function createorder(e) {
      e.preventDefault();
      const token = sessionStorage.getItem("accessToken") || sessionStorage.getItem("jwttoken");
      const tokentype = sessionStorage.getItem("tokentype");
      const userid = sessionStorage.getItem("userid");
      try {
        const response = await axios.post('/add-order', {
          title,
          description,
          phoneNumber,
          subtotal,
          userid
        }, {
          headers: {
            'Authorization': `Bearer ${token}`, 'tokentype': tokentype,
          },
        }).then((res)=>{
          if(res.data){
            alert(res.data.message);
            navigate('/order');
          }
        })
      } catch (error) {
      }
    }

    return (
      <div className="App">
        {authorizedUser ? (
          <>
            <button class="logout" onClick={() => navigate("/logout")}>Logout</button>
            <div class="create-wrap">
              <h2>Create Order</h2>
              <div class="createform">
                <form onSubmit={createorder}>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} placeholder="Title"
                  />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} placeholder="Description"
                  />
                  <input
                    type="text"
                    value={subtotal}
                    onChange={(e) => setSubTotal(e.target.value)} placeholder="Sub Total"
                  />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number"
                  />
                  <button type="submit" >Submit</button>
                </form>
              </div>
            </div>
            <Orders token={sessionStorage.getItem("accessToken") || sessionStorage.getItem("jwttoken")} userid={sessionStorage.getItem("userid")} tokentype={sessionStorage.getItem("tokentype")} />
          </>
        ) : (
          <>
            <Link to='/'><p>Please login to Proceed</p></Link></>
        )}
      </div>
    );
  }


  const Logout = () => {
    const navigate = useNavigate();
    signOut(auth).then(() => {
      sessionStorage.clear();
      setAuthorizedUser(false);
      navigate("/");
    }).catch((error) => {
      alert(error);
    });
  }

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/adduser" element={<SignUp />} />
          <Route path="/" element={<Login />} />
          <Route path="/order" element={<Order />} />
          <Route path="/logout" element={<Logout />} />

        </Routes>
      </div>
    </Router>
  );
};
export default App;
