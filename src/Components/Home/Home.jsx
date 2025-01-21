import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import sweetalert2

const Home = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [mins, setMinutes] = useState(0);
  const [secs, setSeconds] = useState(0);

  const deadline = "January 25, 2025"; // This can be dynamic or fetched

  const fetchEventDetails = async () => {
    try {
      const response = await fetch("http://localhost:5000/save-event-details");
      const data = await response.json();
      if (response.ok) {
        setEventDetails(data); // Set event details data
      } else {
        console.error("Error fetching event details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  useEffect(() => {
    fetchEventDetails(); // Fetch event details when the component mounts
    getTime(); // Initialize countdown
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();
    if (time > 0) {
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    } else {
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  };

  const handleRegisterClick = () => {
    setIsPopupOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.elements.name.value,
      email: e.target.elements.email.value,
      registrationTime: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          title: "Thank you for registering!",
          text: "Redirecting to Eventbrite.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href =
            "https://www.eventbrite.com/e/the-apex-agent-tickets-1198650107739?aff=oddtdtcreator";
        });
      } else {
        throw new Error("Failed to register user");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="lg:p-20 mt-10 p-2">
      <header>
        <h1 className="text-center text-4xl">
          {eventDetails?.headline || "Join Real Estate Expert Gina Hanson"}
        </h1>
        <p className="mt-2 text-xl text-center">
          {eventDetails?.date || "January 25, 2025"} |{" "}
          {eventDetails?.time || "3:00 PM - 6:00 PM"} |{" "}
          {eventDetails?.location || "Online"}
        </p>
        <div className="flex justify-center space-x-4 mt-6">
          {["Days", "Hours", "Minutes", "Seconds"].map((unit, index) => {
            const values = [days, hours, mins, secs];
            return (
              <div key={unit} className="text-center border p-2">
                <h1 className="text-4xl font-bold">
                  {values[index] < 10 ? "0" + values[index] : values[index]}
                </h1>
                <span className="text-sm">{unit}</span>
              </div>
            );
          })}
        </div>
      </header>
      <div>
        {eventDetails?.imageLink ? (
          <img
            className="lg:w-[300px] w-[400px] mx-auto mt-5"
            src={eventDetails.imageLink}
            alt="Event"
          />
        ) : (
          <p className="text-center">Loading event image...</p>
        )}
      </div>
      <main className="lg:max-w-4xl mx-auto my-8 p-4 bg-white rounded-lg shadow-lg">
        <section>
          <h2 className="text-2xl font-semibold text-blue-800 border-b-2 border-yellow-500 pb-2 mb-4">
           
          </h2>
          <p
            className="text-md"
            dangerouslySetInnerHTML={{
              __html: eventDetails?.editorContent || "<p>Loading...</p>",
            }}
          />
        </section>
        <button
          onClick={handleRegisterClick}
          className="block w-full text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg py-4 rounded-lg mt-8 shadow-md hover:from-orange-500 hover:to-red-500 transition"
        >
          Register Now
        </button>
      </main>
      {isPopupOpen && (
        <>
          <div
            onClick={() => setIsPopupOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Register for the Event
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
