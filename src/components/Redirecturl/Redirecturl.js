////do business ke same number nahi ho sakte , dono business ke alag alag number honge, unke basis pe chat search kiya hai

import React, { useEffect, useState } from "react";
import axios from "axios";
import { authentication, createDirectus, realtime } from "@directus/sdk";
import "./Redirecturl.css";

const Redirecturl = () => {
  const [code, setCode] = useState();
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [firstBusinessId, setFirstBusinessId] = useState("");
  const [allBusiness, setAllBusiness] = useState("");
  const [allNumbersOfBusiness, setAllNumbersOfBusiness] = useState();
  const [whatsappbusinessaccountid, setWhatsappbusinessaccountid] =
    useState("");
  const [to, setTo] = useState();
  const [customerTo, setCustomerTo] = useState();
  const [from, setFrom] = useState();
  const [msg, setMsg] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [currentChats, setCurrentChats] = useState();

  const [phoneNumberId, setPhoneNumberId] = useState();
  let clientId = process.env.REACT_APP_CLIENT_ID;
  let clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const directusToken = process.env.REACT_APP_DIRECTUS_ADMINISTRATOR_TOKEN;

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

  // Polling useEffect
  useEffect(() => {
    const interval = setInterval(AllCurrentChats, 2000); // Poll every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [phoneNumberId, directusToken, customerTo]);

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
    // setFirstBusinessId(oneBusinessId);

    setWhatsappbusinessaccountid(""); // Reset whatsapp business id
    setAllNumbersOfBusiness([]); // Clear phone numbers
    setTo(""); // Clear recipient
    setCustomerTo(""); // Clear customer id
    setFrom(""); // Clear sender
    setMsg(""); // Clear message
    setAllChats([]); // Clear all chats
    setCurrentChats([]); // Clear current chats
    setPhoneNumberId(""); // Clear phone number id
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

  useEffect(() => {
    if (from) {
      getAllChats();
    }
  }, [from]);

  const getAllChats = async () => {
    const allChats = await axios.get(
      `http://localhost:8055/items/MessageSentByBusiness`,
      {
        params: {
          filter: {
            From: {
              _eq: phoneNumberId,
            },
          },
        },
        headers: {
          Authorization: `Bearer ${directusToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("allChats", allChats.data.data);
    setAllChats(allChats.data.data);
    // Create a map to filter out duplicate contacts_id
    const uniqueChats = allChats.data.data.reduce((acc, chat) => {
      // Check if chat's contacts_id is already in the map
      if (
        !acc.some(
          (existingChat) => existingChat.contacts_id === chat.contacts_id
        )
      ) {
        acc.push(chat);
      }
      return acc;
    }, []);

    console.log("uniqueChats,", uniqueChats);
    setAllChats(uniqueChats);
  };

  // const AllCurrentChats = async () => {
  //   const response = await axios.get(
  //     `http://localhost:8055/items/MessageSentByBusiness`,
  //     {
  //       params: {
  //         filter: {
  //           From: {
  //             _eq: phoneNumberId,
  //           },
  //           contacts_id: {
  //             _eq: to,
  //           },
  //         },
  //       },
  //       headers: {
  //         Authorization: `Bearer ${directusToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   // Sort the chats by timestamp in ascending order (oldest first)
  //   const sortedChats = response.data.data.sort(
  //     (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  //   );

  //   console.log("AllCurrentChats", sortedChats);
  //   setCurrentChats(sortedChats);

  //   // console.log("AllCurrentChats", response.data.data);
  //   // setCurrentChats(response.data.data);
  // };

  const AllCurrentChats = async () => {
    console.log("cutomerTo", customerTo);
    if (customerTo && phoneNumberId) {
      const response = await axios.get(
        `http://localhost:8055/items/MessageSentByBusiness`,
        {
          params: {
            filter: {
              _or: [
                {
                  From: {
                    _eq: phoneNumberId,
                  },
                  contacts_id: {
                    _eq: to,
                  },
                },
                {
                  From: {
                    _eq: customerTo,
                  },
                  contacts_id: {
                    _eq: phoneNumberId,
                  },
                },
              ],
            },
          },
          headers: {
            Authorization: `Bearer ${directusToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Sort the chats by timestamp in ascending order (oldest first)
      const sortedChats = response.data.data.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      console.log("AllCurrentChats", sortedChats);
      setCurrentChats(sortedChats);
    }
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
      "http://localhost:8055/items/MessageSentByBusiness",

      {
        id: sendMsg.data.messages[0].id,
        From: phoneNumberId,
        timestamp: new Date().toISOString(), // Current timestamp,
        body: `${msg}`,
        type: "text",
        status: "sent",
        contacts_id: Number(`${to}`), //make it contacts_id: `91${to}`;
      },
      {
        headers: {
          Authorization: `Bearer ${directusToken}`,
        },
      }
    );

    // Update the frontend state immediately
    const newMessage = {
      id: sendMsg.data.messages[0].id,
      From: phoneNumberId,
      timestamp: new Date().toISOString(),
      body: `${msg}`,
      type: "text",
      status: "sent",
      contacts_id: Number(`${to}`),
    };

    setCurrentChats((prevChats) => [newMessage, ...prevChats]);

    // Clear the message input field
    setMsg("");

    // Optionally, you can re-fetch all chats to ensure consistency
    AllCurrentChats();
  };

  return (
    <div>
      <header className="bg-success text-white text-center py-2">
        <h1>Whatsapp Integrate</h1>
      </header>
      <div className="row mt-3" style={{ height: "580px" }}>
        <div className="allbusiness col-md-2 border border-success">
          <h5>All Businesses</h5>
          <ul className="list-group">
            {allBusiness ? (
              allBusiness.map((onebusiness) => (
                <div key={onebusiness.id}>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-secondary btn-sm btn-block w-100"
                      onClick={() =>
                        selectBusinessAndSetWhatsappBusinessId(onebusiness.id)
                      }
                    >
                      {onebusiness.name}
                    </button>
                  </li>
                </div>
              ))
            ) : (
              <li className="list-group-item">No businesses found</li>
            )}
          </ul>
        </div>
        <div className="allbusinessNumbers col-md-2 border border-success">
          <h5>all numbers of business</h5>
          <ul className="list-group">
            {allNumbersOfBusiness ? (
              <>
                {allNumbersOfBusiness.map((number) => (
                  <li
                    key={number.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <button
                      className="btn btn-secondary btn-sm btn-block w-100"
                      onClick={() => {
                        setPhoneNumberId(number.id);
                        setFrom(number.display_phone_number);
                      }}
                    >
                      {number.display_phone_number}
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
        <div className="allChats col-md-3 border border-success ">
          <h5>all chats</h5>
          <ul className="list-group">
            {allChats ? (
              <>
                {allChats.map((eachChat) => (
                  <li
                    key={eachChat.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <button
                      className="btn btn-secondary btn-sm btn-block w-100"
                      onClick={() => {
                        setTo(eachChat.contacts_id);
                        setCustomerTo(91 + eachChat.contacts_id);
                        AllCurrentChats();
                      }}
                    >
                      {eachChat.contacts_id}
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
        <div className="SingleChat col-md-5 border border-success">
          <div className="chat-header">
            <span className="chat-label">From:</span>
            <span className="chat-from">{from && from}</span>
          </div>
          <div className="chat-input">
            <label className="chat-label">To:</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="chat-to-input"
            />
          </div>
          <div className="chat-messages overflow-auto h-400px p-3 border bg-light">
            {currentChats ? (
              currentChats.map((Chat) => (
                <div
                  key={Chat.id}
                  className={`message-container ${
                    Chat.From === phoneNumberId
                      ? "message-from-phone"
                      : "message-from-customer"
                  }`}
                >
                  <div className="message-bubble">{Chat.body}</div>
                </div>
              ))
            ) : (
              <div className="no-messages">No messages</div>
            )}
          </div>
          <div className="chat-input">
            <label className="chat-label">Message:</label>
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="chat-msg-input w-100 mb-3"
            />
          </div>
          <button
            className="btn btn-secondary btn-sm btn-block w-100 mb-2"
            onClick={sendMessage}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default Redirecturl;
