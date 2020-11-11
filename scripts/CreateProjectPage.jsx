import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';
import Dash from './Dash';
import './CreateProjectPage.css';

export default function CreateProjectPage() {
    const [code, setCode] = useState('');
    const [users, setUsers] = useState([]);
    const [profilePic, setProfilePic] = useState([]);
    let groupCode = '';
    const selectedUsers = [];
    // Gets all authenticated users from login page
    useEffect(() => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 10; i += 1) {
            groupCode += characters.charAt(Math.floor(Math.random() * 62));
        }
        setCode(groupCode);
    }, []); 
    
    useEffect(() => {
        Socket.on('get user list', (data) => {
            console.log("getting user list");
            setUsers(data.all_users);
            setProfilePic(data.all_profile_pics);
        });
        return () => {
            Socket.off('get user list', (data) => {
                setUsers(data.all_users);
                setProfilePic(data.all_profile_pics);
            });
        };
    }, []);


    // Gathers submitted information and sends to server
    function handleSubmit(event) {
        const projectName = document.getElementById('name').value;
        const projectDescription = document.getElementById('description').value;
        Socket.emit('create project', {
            projectName,
            projectDescription,
            code,
            selectedUsers,
        });


    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    event.preventDefault();
    console.log("here")
    return(<Dash />)
    
  }

    // Handles user selection checkboxes
    function handleClick(event) {
        const { checked, value } = event.target;
        if (checked) {
            selectedUsers.push(value);
        } else {
            for (let i = 0; i < selectedUsers.length; i += 1) {
                if (selectedUsers[i] === value) {
                    selectedUsers.splice(i, 1);
                }
            }
        }
    }

    return (
        <div id="form">
            <h1 className="size">
                Create Project
                <span className="right">
                    Group Code:
                    {' '}
                    {code}
                </span>
            </h1>
            <h1 className="right pad">
                <br />
                Select users to add:
            </h1>

            <form onSubmit={handleSubmit} autoComplete="off">
                <br />
                <br />
                <textarea className="textarea" id="name" placeholder="Project Name" />
                <br />
                <br />
                <textarea className="textarea" id="description" placeholder="Project Description" />
                <label className="right pad">
                    {users.map((user, index) => (
                        <li className="list" key={index.id}>
                            <input type="checkbox" value={user} onClick={handleClick} />
                            {' '}
                            <img className="profilePic" src={profilePic[index]} alt="Invalid pic link" />
                            {' '}
                            {user}
                            <br />
                            <br />
                        </li>
                    ))}
                </label>
                <br />
                <br />
                <br />
                <button id="submit" type="submit">Create</button>
            </form>
        </div>
    );
}
