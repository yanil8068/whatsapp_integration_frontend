import React, { useEffect, useState } from "react";
import axios from "axios";

const Redirecturl = () => {
  const [code, setCode] = useState();
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [firstBusinessId, setFirstBusinessId] = useState("");
  const [allBusiness, setAllBusiness] = useState("");
  const [allNumbersOfBusiness, setAllNumbersOfBusiness] = useState();
  const [whatsappbusinessaccountid, setWhatsappbusinessaccountid] =
    useState("");
  const [to, setTo] = useState();
  const [from, setFrom] = useState();
  const [msg, setMsg] = useState("");

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

  useEffect(() => {
    if (code && !token) {
      fetchAccessToken();
    }
  }, [code]);

  useEffect(() => {
    if (token) {
      getBusiness();
    }
  }, [token]);

  const url = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=${clientId}&redirect_uri=http://localhost:3000/redirecturl&client_secret=${clientSecret}&code=${code}`;

  const fetchAccessToken = async () => {
    try {
      const response = await axios.post(url);
      setToken(response.data);
      console.log("Access Token Response:", response.data.access_token);
      setToken(response.data.access_token);
      localStorage.setItem("accessToken", response.data.access_token);
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
    setAllBusiness(business.data.data);

    setFirstBusinessId(business.data.data[2].id);
  };
  console.log("allBusiness", allBusiness);

  useEffect(() => {
    if (whatsappbusinessaccountid) {
      getAllPhoneNumbersOfBusiness();
    }
  }, [whatsappbusinessaccountid]);

  const selectBusinessAndSetWhatsappBusinessId = async (oneBusinessId) => {
    setFirstBusinessId(oneBusinessId);
    await getwhatsappBuisnessId();
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
    console.log("setwhatappBusinessIdAll", businessNumber.data);
    console.log("setwhatappBusinessId", businessNumber.data.data[0].id);
    setWhatsappbusinessaccountid(businessNumber.data.data[0].id);
  };

  const getAllPhoneNumbersOfBusiness = async () => {
    const phoneNumbers = await axios.get(
      `https://graph.facebook.com/v20.0/${whatsappbusinessaccountid}/phone_numbers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Phone Numbers:", phoneNumbers.data.data);
    setAllNumbersOfBusiness(phoneNumbers.data.data);
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
    console.log("Phone Numbers:", phoneNumbers.data.data);
    setAllNumbersOfBusiness(phoneNumbers.data.data);
    console.log("allnumbersofbusiness", allNumbersOfBusiness);
    console.log("Phone Numbers testing:", phoneNumbers.data.data[0].id);
    setPhoneNumberId(phoneNumbers.data.data[0].id);
  };

  const sendMessage = async () => {
    const sendMsg = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        recepient_type: "individual",
        to: `91${to}`,
        type: "text",
        text: {
          preview_url: false,
          body: `${msg}`,
        },
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    let fromm = phoneNumberId.toString();
    console.log("from", fromm);

    const saveToDirectus = await axios.post(
      "http://localhost:8055/items/MessagesSentByBusiness",
      {
        id: sendMsg.data.messages[0].id,
        From: phoneNumberId,
        timestamp: "2024-08-27T10:30:00",
        body: `${msg}`,
        type: "text",
        status: "sent",
        contacts_id: 1, ////make it contacts_id: `91${to}`;
      },
      {
        withCredentials: true,
      }
    );

    console.log("sent message", sendMsg.data.messages[0].id);
    console.log("saveToDirectus", saveToDirectus);
    setMsg("");
  };

  return (
    <div>
      All businesses
      <br />
      {/* <button onClick={fetchAccessToken} disabled={!code}>
        Fetch Access Token
      </button> */}
      {/* <br /> <br /> <br /> */}
      {/* <button onClick={getBusiness}>get all businesses</button> */}
      {/* <br /> <br /> <br /> */}
      <ul>
        {allBusiness ? (
          allBusiness.map((onebusiness) => (
            <div key={onebusiness.id}>
              <li>
                {onebusiness.name}
                <button
                  onClick={() =>
                    selectBusinessAndSetWhatsappBusinessId(onebusiness.id)
                  }
                >
                  use this business
                </button>
              </li>
            </div>
          ))
        ) : (
          <></>
        )}
      </ul>
      <br />
      {/* <button onClick={getwhatsappBuisnessId}>
        get whatsapp business account id
      </button> */}
      <br />
      <hr />
      <div>
        all numbers of business
        <br />
      </div>
      {allNumbersOfBusiness ? (
        <>
          {allNumbersOfBusiness.map((number) => (
            <div key={number.id}>
              {number.display_phone_number}
              <button
                onClick={() => {
                  setPhoneNumberId(number.id);
                  setFrom(number.display_phone_number);
                }}
              >
                use this number
              </button>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
      {/* <button onClick={getPhoneNumberId}>get PhoneNumber id</button>
      phone number id :{" "}
      {phoneNumberId ? (
        <>{phoneNumberId}</>
      ) : (
        <>Please set phone number id to send message</>
      )} */}
      <br /> <br /> <br />
      <hr />
      from:{from ? <>{from}</> : <></>}
      <br />
      {"   "} to:{" "}
      <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
      <br />
      <br />
      message:{" "}
      <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} />
      <br />
      <br />
      <button onClick={sendMessage}>sendMessage</button>
      <div>
        Make sure that the phone number you're trying to send a message to has
        interacted with your WhatsApp Business number before
      </div>
    </div>
  );
};

export default Redirecturl;
