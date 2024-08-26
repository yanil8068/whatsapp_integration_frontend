import React, { useEffect, useState } from "react";
import axios from "axios";

const Redirecturl = () => {
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [firstBusinessId, setFirstBusinessId] = useState("");
  const [whatsappbusinessaccountid, setWhatsappbusinessaccountid] =
    useState("");

  const [phoneNumberId, setPhoneNumberId] = useState();
  let clientId = process.env.REACT_APP_CLIENT_ID;
  let clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  // console.log("clientid", clientId);

  // console.log("clientsecret", clientSecret);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const retrievedCode = searchParams.get("code");
    setCode(retrievedCode);
    console.log("code", retrievedCode);
  }, []);

  const url = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=${clientId}&redirect_uri=http://localhost:3000/redirecturl&client_secret=${clientSecret}&code=${code}`;

  const fetchAccessToken = async () => {
    try {
      const response = await axios.post(url);
      setToken(response.data);
      console.log("Access Token Response:", response.data.access_token);
      setToken(response.data.access_token);
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  const getBusiness = async () => {
    const business = await axios.get(
      "https://graph.facebook.com/v15.0/me/businesses",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("respons of getBuisness", business.data);
    setFirstBusinessId(business.data.data[2].id);
  };

  const getwhatsappBuisnessId = async () => {
    const businessNumber = await axios.get(
      `https://graph.facebook.com/v20.0/${firstBusinessId}/owned_whatsapp_business_accounts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Phone Numbers:", businessNumber.data);
    console.log("Phone Numbers exact:", businessNumber.data.data[0].id);
    setWhatsappbusinessaccountid(businessNumber.data.data[0].id);
  };

  const getPhoneNumberId = async () => {
    const phoneNumbers = await axios.get(
      `https://graph.facebook.com/v20.0/${whatsappbusinessaccountid}/phone_numbers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Phone Numbers:", phoneNumbers.data);
    console.log("Phone Numbers testing:", phoneNumbers.data.data[0].id);
    setPhoneNumberId(phoneNumbers.data.data[0].id);
  };

  const sendMessage = async () => {
    const sendMsg = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: "918552035822",
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US",
          },
        },
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("sent message", sendMsg.data);
  };

  return (
    <div>
      Redirect URL - Code: {code}
      <br />
      <button onClick={fetchAccessToken} disabled={!code}>
        Fetch Access Token
      </button>
      <br /> <br /> <br />
      <button onClick={getBusiness}>get all businesses</button>
      <br /> <br /> <br />
      <button onClick={getwhatsappBuisnessId}>
        get whatsapp business account id
      </button>
      <br /> <br /> <br />
      <button onClick={getPhoneNumberId}>get PhoneNumber id</button>
      <br /> <br /> <br />
      <button onClick={sendMessage}>sendMessage to</button>
    </div>
  );
};

export default Redirecturl;
