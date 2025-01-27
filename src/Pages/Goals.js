import React from "react";
import DashboardHeader from "../Components/DashboardHeader";
import styles from '../App.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const Goals = ({logout, toggle, toggleMenu, menuOpen, goals, handleClick}) => {
 return(
<>
<div>
<DashboardHeader logout={logout} toggle={toggleMenu} menuOpen={menuOpen} />
</div>
<div className= {styles.goalsContainer}>
    <div className= {styles.goalsContainerHeading}>
    <h1>What are your goals for this app?</h1>
    </div>

    <div className= {styles.cardContainer}>
    {goals ? 
    <Link to = "/Tracker" className= {styles.links}>
      <div className= {styles.cards}>
        <div className= {styles.cardWrapper}>
        <h1>Lose Weight</h1>
        <p>I want this app to help me lose weight!</p>
        <FontAwesomeIcon

        icon = {faBullseye}
        className= {styles.icon}

        />
        </div>
        </div>
        </Link>      

        :
        <div className= {styles.cards}>
<div className= {styles.cardWrapper}>
<h1>Lose Weight</h1>
<p>I want this app to help me lose weight!</p>
<FontAwesomeIcon

icon = {faBullseye}
className= {styles.icon}

/>
    
</div>
</div>
} 
</div>

<div className= {styles.cardContainer}>
    <Link to = "/Tracker" className= {styles.links}>
      <div className= {styles.cards}>
        <div className= {styles.cardWrapper}>
        <h1>Gain Weight</h1>
        <p>I want this app to help me gain weight!</p>
        <FontAwesomeIcon

        icon = {faBullseye}
        className= {styles.icon}

        />

        </div>
        </div>
        </Link>
</div>

<div className= {styles.cardContainer}>
    <button name = "maintain" data-id = "maintain" onClick={() => handleClick({goals:' maintain'})}>
      <div className= {styles.cards}>
        <div className= {styles.cardWrapper}>
        <h1>Maintain Weight</h1>
        <p>I want this app to help me maintain my weight!</p>
        <FontAwesomeIcon

        icon = {faBullseye}
        className= {styles.icon}

        />

        </div>
        </div>
        </button>
</div>
</div>
</>
 )
}

export default Goals