import React, { useState, useEffect } from "react"
import api from '../services/api'


function Player() {

    const [name, setName] = useState()
    const [role, setRole] = useState()
    const [team, setTeam] = useState()
    const route = 'players/'
    const title = 'Player Registration'

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await api.post(route, { name, role,team })
        } catch (error) {
            alert(error);
        }
    }


    // return <Form route="/api/user/register/" method="register" />

    return(<>
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{title}</h1> 
            
            {/* FOR NAME  */}
            <input
                className="form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Username"
            />
            <br />
            
            {/* FOR ROLE SELECTION */}
            <input
                className="form-input"
                type="radio"
                value="Batsman"
                id='batsman'
                name="role"
                onChange={(e) => setRole(e.target.value)}
            />
            <label htmlFor="batsman">Batsman</label>
            
            <input
                className="form-input"
                type="radio"
                value="Bowler"
                id='bowler'
                name="role"
                onChange={(e) => setRole(e.target.value)}
            />
            <label htmlFor="bowler">Bowler</label>
            
            <input
                className="form-input"
                type="radio"
                value="All-Rounder"
                id='allrounder'
                name="role"
                onChange={(e) => setRole(e.target.value)}
            />
            <label htmlFor="allrounder">All-Rounder</label>
            <br />
            
             {/* FOR TEAM  */}
            <input
                className="form-input"
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Team"
            />
            <br />


            {/* {loading && <LoadingIndicator />} */}

            <button className="form-button" type="submit">
                Submit
            </button>
        </form>
    </>)
}

export default Player