import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [user, setUser] = useState();

  const redirect_url = process.env.REACT_APP_REDIRECT_URL;
  const client_id = process.env.REACT_APP_CLIENT_ID;
  const url = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${client_id}&redirect_uri=${redirect_url}&scope=whatsapp_business_management,business_management,whatsapp_business_messaging&response_type=code`;
  useEffect(() => {
    const getMe = async () => {
      const res = await axios.get("http://localhost:8055/users/me", {
        withCredentials: true,
        params: {
          fields: ["*"],
        },
      });
      const data = res.data;
      console.log("data,", data);
      setUser(data);
    };
    getMe();
  }, []);

  const SubmitForm = (e) => {
    e.preventDefault();
    console.log("clientid", client_id);
    console.log("rediercturl", redirect_url);
    window.location.href = url;
  };

  // console.log(user);
  return (
    <div>
      Home
      <br />
      <form onSubmit={SubmitForm}>
        <button type="submit">FACEBOOK OAUTH</button>
      </form>
    </div>
  );
};

export default Home;
