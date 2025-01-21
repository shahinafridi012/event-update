import React, { useState, useEffect } from "react";
import { Editor } from "primereact/editor";
import Swal from "sweetalert2";
import axios from "axios";

const Admin = () => {
    const [selectedSection, setSelectedSection] = useState("users");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [headline, setHeadline] = useState("Join Real Estate Expert Gina Hanson");
    const [deadline, setDeadline] = useState("January 25, 2025");
    const [eventDetails, setEventDetails] = useState({
        date: "January 25, 2025",
        time: "3:00 PM - 6:00 PM",
        location: "Online",
    });
    const [editorContent, setEditorContent] = useState("<p>Event details go here...</p>");
    const [imageLink, setImageLink] = useState(
        "https://i.ibb.co/rkrgd7C/veranstaltungen-immobilienbranche.jpg"
    );
    const [webLink, setWebLink] = useState(
        "https://www.eventbrite.com/e/the-apex-agent-tickets-1198650107739?aff=oddtdtcreator"
    );

    // Fetch users from backend
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("https://event-update-server.vercel.app/users");
            setUsers(response.data || []);
        } catch (err) {
            setError("Failed to fetch users. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch event details from backend
    const fetchEventDetails = async () => {
        try {
            const response = await axios.get("https://event-update-server.vercel.app/save-event-details");
            if (response.data) {
                setEventDetails(response.data.eventDetails || {});
                setHeadline(response.data.headline || "");
                setDeadline(response.data.deadline || "");
                setEditorContent(response.data.editorContent || "");
                setImageLink(response.data.imageLink || "");
                setWebLink(response.data.webLink || "");
            }
        } catch (err) {
            console.error("Failed to fetch event details:", err);
        }
    };

    // Save event details
    const handleSave = async () => {
        const data = {
            date: eventDetails.date,
            time: eventDetails.time,
            location: eventDetails.location,
            headline,
            deadline,
            editorContent,
            imageLink,
            webLink,
        };

        try {
            const response = await axios.post("https://event-update-server.vercel.app/save-event-details", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Details saved successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (err) {
            console.error("Error saving event details:", err);
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: err.response ? err.response.data.message : "Please try again later.",
            });
        }
    };

    useEffect(() => {
        if (selectedSection === "users") {
            fetchUsers();
        } else if (selectedSection === "eventDetails") {
            fetchEventDetails();
        }
    }, [selectedSection]);

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="w-full lg:w-64 bg-gray-800 text-white p-6">
                <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
                <ul className="space-y-4">
                    <li
                        onClick={() => setSelectedSection("users")}
                        className={`cursor-pointer px-4 py-2 rounded ${
                            selectedSection === "users" ? "bg-gray-600" : ""
                        } hover:bg-gray-700`}
                    >
                        Users
                    </li>
                    <li
                        onClick={() => setSelectedSection("eventDetails")}
                        className={`cursor-pointer px-4 py-2 rounded ${
                            selectedSection === "eventDetails" ? "bg-gray-600" : ""
                        } hover:bg-gray-700`}
                    >
                        Event Details
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6">
                <h1 className="text-xl md:text-3xl font-bold mb-6">
                    {selectedSection === "users" ? "Users" : "Event Details"}
                </h1>

                {/* Users Section */}
                {selectedSection === "users" && (
                    <div>
                        {loading && <p className="text-gray-500">Loading users...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {users && (
                            <div>
                                <p className="text-md md:text-lg font-semibold mb-4">
                                    Total Users: {users.length}
                                </p>
                                <div className="overflow-x-auto">
                                    <table className="w-full bg-white border border-gray-300">
                                        <thead className="bg-gray-800 text-white">
                                            <tr>
                                                <th className="px-4 py-2 md:px-6 md:py-3 text-left">Name</th>
                                                <th className="px-4 py-2 md:px-6 md:py-3 text-left">Email</th>
                                                <th className="px-4 py-2 md:px-6 md:py-3 text-left">
                                                    Registration Time
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr
                                                    key={user._id}
                                                    className="hover:bg-gray-100 text-sm md:text-base"
                                                >
                                                    <td className="px-4 py-2 md:px-6 md:py-3">{user.name}</td>
                                                    <td className="px-4 py-2 md:px-6 md:py-3">{user.email}</td>
                                                    <td className="px-4 py-2 md:px-6 md:py-3">
                                                        {new Date(user.registrationTime).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Event Details Section */}
                {selectedSection === "eventDetails" && (
                    <div>
                        <div className="mb-4">
                            <label className="block text-sm md:text-lg mb-2">Event Deadline</label>
                            <input
                                type="text"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full border rounded p-2 md:p-3"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm md:text-lg mb-2">Event Headline</label>
                            <input
                                type="text"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                className="w-full border rounded p-2 md:p-3"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm md:text-lg mb-2">Event Date</label>
                            <input
                                type="text"
                                value={eventDetails.date}
                                onChange={(e) =>
                                    setEventDetails({ ...eventDetails, date: e.target.value })
                                }
                                className="w-full border rounded p-2 md:p-3"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm md:text-lg mb-2">Event Time</label>
                            <input
                                type="text"
                                value={eventDetails.time}
                                onChange={(e) =>
                                    setEventDetails({ ...eventDetails, time: e.target.value })
                                }
                                className="w-full border rounded p-2 md:p-3"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm md:text-lg mb-2">Event Location</label>
                            <input
                                type="text"
                                value={eventDetails.location}
                                onChange={(e) =>
                                    setEventDetails({ ...eventDetails, location: e.target.value })
                                }
                                className="w-full border rounded p-2 md:p-3"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm md:text-lg font-medium mb-2">
                                Event Description
                            </label>
                            <Editor
                                value={editorContent}
                                onTextChange={(e) => setEditorContent(e.htmlValue)}
                                style={{ height: "200px" }}
                            />
                        </div>
                        <div className="mb-4">
                        <label>Image Live Link</label>
                            <input
                                type="text"
                                value={imageLink}
                                onChange={(e) => setImageLink(e.target.value)}
                                placeholder="Image Link"
                                className="w-full border rounded p-2 md:p-3 mb-3"
                            />
                            <label>Web Link</label>
                            <input
                                type="text"
                                value={webLink}
                                onChange={(e) => setWebLink(e.target.value)}
                                placeholder="Web Link"
                                className="w-full border rounded p-2 md:p-3"
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        >
                            Save Updates
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
