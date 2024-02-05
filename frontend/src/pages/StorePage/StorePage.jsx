import React, { useEffect } from "react";
import { useState } from "react";
import "./StorePage.css";

import Navbar from "../../components/Navbar/Navbar";
import HomePage from "../HomePage/HomePage";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import storeItems from "../../data/storeItems";

import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import Card from "../../components/StoreComponents/Card/Card";

function StorePage() {
  const [heroUrl, setHeroUrl] = useState(
    localStorage.getItem("heroUrl") || "/images/aibo.png"
  );
  const data = localStorage.getItem("storeItems");
  const [items, setItems] = useState(JSON.parse(data) || storeItems);

  const [notification, setNotification] = useState(null);
  const session = useSession(); // tokens
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  useEffect(() => {
    localStorage.setItem("heroUrl", heroUrl);
    localStorage.setItem("storeItems", JSON.stringify(items));
  }, [heroUrl]);

  // no more flickering when we refresh the website
  if (isLoading) {
    return <></>;
  }

  // Close the notification
  const closeNotification = () => {
    setNotification(null);
  };

  async function signOut() {
    await supabase.auth.signOut();
    setNotification("Signed out successfully.");
  }

  const changeHero = (card) => {
    // if(card.id !== 0)
    const url =
      card.id === 0
        ? "/images/aibo.png"
        : card.imageSrc.split(".")[0] + "-aibo.png";
    setHeroUrl(url);
  };

  // console.log("items: ", items);
  console.log("store items: ", storeItems);

  return (
    <div className="store-page">
      {session ? (
        <>
          <Navbar />
          <Button label="Sign Out" callback={signOut} />

          <div className="card-container">
            {items.map((card, idx) => (
              <Card
                key={card.id}
                imageSrc={card.imageSrc}
                levelRequired={card.levelRequired}
                title={card.title}
                onEquipClick={() => {
                  card.isCurrentlyEquipped = true;
                  // eslint-disable-next-line
                  items.map((c) => {
                    if (c.id !== card.id) c.isCurrentlyEquipped = false;
                  });
                  changeHero(card);
                  setItems(items);
                }}
                isCurrentlyEquipped={items[idx].isCurrentlyEquipped}
                onRemoveItem={() => {
                  card.isCurrentlyEquipped = false;
                  setHeroUrl("/images/aibo.png");
                  setItems(items);
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <HomePage />
      )}
      {notification && (
        <Notification message={notification} onClose={closeNotification} />
      )}
    </div>
  );
}

export default StorePage;
