import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [user, setUser] = useState();
  const [client_id, setClient_id] = useState("");
  const [redirect_url, setRedirect_Url] = useState("");
  const url =
    "https://www.facebook.com/v15.0/dialog/oauth?client_id=" +
    client_id +
    "&redirect_uri=" +
    redirect_url +
    "&scope=whatsapp_business_management,business_management,whatsapp_business_messaging&" +
    "response_type=code";
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
        client_id:
        <input
          type="text"
          value={client_id}
          onChange={(e) => setClient_id(e.target.value)}
        />
        <br />
        redirect_url:
        <input
          type="text"
          value={redirect_url}
          onChange={(e) => setRedirect_Url(e.target.value)}
        />
        <br />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default Home;
