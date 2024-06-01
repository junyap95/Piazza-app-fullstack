import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    console.log(e.target.value);

    // refer to <input>'s name and value
    // this is same as creating 2 variables: const name = e.target.name ...etc
    const { name, value } = e.target;

    // if without spread and using previous state, it will just replace the state that has 3 key-value pairs to one, as we are only changing one pair below, the spreading spreads out all pairs and we are only updating the specific pair as below
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("User Registered", userData);
      } else {
        const errorData = await response.json();
        console.error("Registration Failed: ", errorData);
      }
    } catch (error) {
      console.error("Error during registration,error");
    }
  };

  return (
    <div className="register-box">
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username"
            onChange={handleChange}
          ></input>
        </label>
        <label>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
          ></input>
        </label>
        <label>
          <input
            type="text"
            name="email"
            value={formData.email}
            placeholder="Email Address"
            onChange={handleChange}
          ></input>
        </label>
        <button type="submit">CREATE ACCOUNT</button>
      </form>
    </div>
  );
}

export default Register;
