import React, { useState } from "react";
import { Link } from "react-router-dom";
import  DeleteConfirmation  from "./DeleteConfirmationPopUp";
import "../styles/Settings.css";
import { getAuth, deleteUser, updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

const Settings = ({ user }) => {
  // State for toggling the settings visibility
  const [showSettings, setShowSettings] = useState(true);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [error] = useState("");

  // Function for handling the closing of the settings modal
  const handleSettingsClose = () => {
    setShowSettings(false);
    window.history.back();
  };

  // Hide settings when not active
  if (!showSettings) return null;

  // Function to change the display name - WORKING PROGRESS
  const changeDisplayName = async (newDisplayName) => {
    // Check if the user is logged in
    const auth = getAuth();
    const user = auth.currentUser;
    try {
        if (user) {
            // Fetch user's email
            const userEmail = user.email;

            // Delete existing document
            await deleteDoc(doc(db, "users", user.uid));
            console.log("Deleted old user document from Firestore");

            // Update user profile display name
            await updateProfile(user, {
                displayName: newDisplayName,
            });
            console.log("Updated user profile display name");

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                username: newDisplayName,
                email: userEmail,
            });
            console.log("Created new user document in Firestore");
        }
    } catch (error) {
        console.error("Error occurred while updating user data:", error);
    }
};

  

  // DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      if (user) {
        await deleteUser(user);
        console.log("User account deleted successfully");

        await deleteDoc(doc(db, "users", user.uid)); // Delete user document from Firestore
      } else {
        console.error("No user signed in");
      }
    } catch (error) {
      console.error("Error deleting user account:", error.message);
      
    }
  };

  return (
    // Modal container so it pops up instead of redirecting to a new page
    <div className="modal">
      {/* Content inside the modal is the settings page*/}
      <div className="modal-content">
        {/* Container for the close button */}
        <div className="close-button">
          <Link onClick={handleSettingsClose}>
            {/* Link wrapper for triggering the close action */}
            <span className="close-icon">&times;</span>

            {/* Text representation of the 'ESC' key/symbol */}
            <span className="close-text">ESC</span>
          </Link>
        </div>{" "}
        {/* end of close-button */}
        {/* Form for user settings */}
        <h2>Settings</h2>
        <div className="settings-form">
          {/* Column container for settings */}
          <div className="column">
            {/* Subtitle for the account settings */}
            <h3>Account Settings</h3>
            <label htmlFor="profilePic">Profile Picture:</label>
            {/* Label for profile picture input */}
            <div className="profile-picture">
              {/* Container for profile picture */}
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
              />
              {/* end of profile picture */}
            </div>{" "}
            {/* end of column */}
            <label htmlFor="displayName">Display Name:</label>
            {/* Label for display name input with text type and placeholder text*/}
            <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newDisplayName">New Display Name:</label>
              <input
                type="text"
                id="newDisplayName"
                name="newDisplayName"
                placeholder="Enter new display name"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
              <button onClick={() => changeDisplayName(newDisplayName)}>
                Change Display Name
              </button>
              {error && <p className="error-message">{error}</p>}
          </form>
            {/* Label for email input with email type and placeholder text*/}
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Change your email"
            />
            {/* Title for the change password section */}
            <h3>Change Password</h3>
            <label htmlFor="currentPassword">Current Password:</label>
            {/* Label for current password input with type password and placeholder*/}
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              placeholder="Enter Current Password"
            />
            <label htmlFor="newPassword">New Password:</label>
            {/* Label for new password input */}
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter New Password"
            />
            {/* Label for confirming new password input type password and placeholder*/}
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
            />
            {/* Change Password Button */}
            <div className="settings-content">
              <button className="change-button">Change Password</button>
            </div>{" "}
            {/* end of settings-content */}
          </div>{" "}
          {/* end of column */}
        </div>{" "}
        {/* end of settings-form */}
        <form className="settings-form">
          <div className="column">
            {/* Subtitle for the danger zone */}
            <h3>Danger Zone</h3>
            {/* Delete Account */}
            <div className="settings-content">
            <DeleteConfirmation onDelete={handleDeleteAccount} />
            </div>
            {/* end of settings-content */}
          </div>
          {/* end of column */}
        </form>
        {/* end of settings-form */}
        <form className="settings-form">
          {/* Form for privacy settings */}
          <div className="column">
            {/* Column wrapper */}
            <h3>Privacy Settings</h3> {/* Title for privacy settings section */}
            {/* Dropdown to control who can contact */}
            <label htmlFor="contactControl">Control Who Can Contact You:</label>
            <select id="contactControl" name="contactControl">
              {/* Option for allowing everyone to contact */}
              <option value="everyone">Everyone</option>

              {/* Option for allowing friends only to contact */}
              <option value="friends">Friends Only</option>

              {/* Option for not allowing anyone to contact */}
              <option value="none">No One</option>
            </select>
            {/* Dropdown for status visibility */}
            <label htmlFor="statusVisibility">Status Visibility:</label>
            <select id="statusVisibility" name="statusVisibility">
              {/* Option for status visible to all */}
              <option value="visible">Visible to All</option>

              {/* Option for status visible to friends */}
              <option value="friends">Visible to Friends</option>

              {/* Option for hiding the status */}
              <option value="hidden">Hidden</option>
            </select>
            {/* Dropdown for setting status message */}
            <label htmlFor="statusMessage">Status Message:</label>
            <select id="statusMessage" name="statusMessage">
              {/* Option for online status */}
              <option value="Online">Online</option>

              {/* Option for offline status */}
              <option value="Offline">Offline</option>
            </select>
          </div>
          {/* end of column */}
        </form>
        {/* end of settings form */}
        {/* Form for notification and appearance settings */}
        <form className="settings-form">
          {/* Column wrapper */}
          <div className="column">
            {/* Title for settings section */}
            <h3>Notification & Appearance Settings</h3>
            {/* Row for enabling notifications */}
            <div className="form-row">
              {/* Label for notifications */}
              <label htmlFor="notifications">Enable Notifications:</label>

              {/* Checkbox to enable notifications */}
              <input type="checkbox" id="notifications" name="notifications" />
            </div>
            {/* Label for selecting the theme */}
            <label htmlFor="theme">Choose Theme:</label>
            {/* Dropdown for theme selection */}
            <select id="theme" name="theme">
              {/* Option for selecting the light theme */}
              <option value="light">Light Theme</option>

              {/* Option for selecting the dark theme */}
              <option value="dark">Dark Theme</option>
            </select>
            {/* Content wrapper */}
            <div className="settings-content">
              {/* Button to save changes */}
              <button className="change-button" onClick={handleSettingsClose}>
                Save Changes
              </button>
            </div>{" "}
            {/* end of settings-content */}
          </div>{" "}
          {/* end of column */}
        </form>{" "}
        {/* end of settings-form */}
      </div>{" "}
      {/* end of modal-content */}
    </div>
  );
};

export default Settings;
