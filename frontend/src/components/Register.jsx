import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../index.css'

const Signup = () => {

  const [Semail, setEmail] = useState("");
  const [Spassword, setPassword] = useState("");
  const [signupResponse, setSignupResponse] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    if(Spassword == ""){
      setSignupResponse("blank password");
      return;
    }
    const response = await fetch('http://127.0.0.1:3000/register', {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        email: Semail,
        password: Spassword,
      }),
    })
    
    const json = await response.json();
    if(response.status == 200){
      nav(-1);
    }else{
      setSignupResponse(json.msg)
    }
  }

  return (
    <div>
      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <br/>
      <input placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
      <br/>
      <button type="button" onClick={submit}>SignIn</button>
      <br/>
      {signupResponse}
    </div>
  )
}

export default Signup;