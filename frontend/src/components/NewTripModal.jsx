import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export function NewTripModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [destinations, setDestinations] = useState([""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transportationPreference, setTransportationPreference] = useState("driving-car");
  const [hotelPreference, setHotelPreference] = useState("");
  const [budget, setBudget] = useState("");

  const [preview, setPreview] = useState(null);

  // ADD HERE
  const handlePreview = async () => {
    try {

      const res = await API.post("/trips/preview", {
        title,
        destinations,
        startDate,
        endDate,
        transportationPreference,
        hotelPreference,
        budget,
      });

      setPreview(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // SAVE TRIP
  const handleSave = async () => {
    try {

      await API.post("/trips", preview);

      navigate("/my-trips");

      onClose();

    } catch (error) {
      console.log(error);
    }
  };
    return (
    <div>

      {/* FORM INPUTS */}

      <input
        placeholder="Trip Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Destination"
        value={destinations[0]}
        onChange={(e) => setDestinations([e.target.value])}
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <input
        placeholder="Hotel Name"
        value={hotelPreference}
        onChange={(e) => setHotelPreference(e.target.value)}
      />

      <input
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />

      <select
        value={transportationPreference}
        onChange={(e) => setTransportationPreference(e.target.value)}
      >
        <option value="driving-car">Car</option>
        <option value="cycling-regular">Bike</option>
        <option value="foot-walking">Walking</option>
      </select>

      {/* PREVIEW BUTTON */}
      <button onClick={handlePreview}>
        Preview Trip
      </button>

      {/* PREVIEW DATA */}
      {preview && (
        <div>

          <h2>{preview.title}</h2>

          <p>
            Distance:
            {preview.totalDistanceKm} km
          </p>

          <p>
            Duration:
            {preview.totalDurationMinutes} mins
          </p>

          {preview.destinations.map((d, index) => (
            <div key={index}>
              <h3>{d.name}</h3>

              <p>
                Weather:
                {d.weather.temperature}°C
              </p>

              <p>
                Condition:
                {d.weather.condition}
              </p>

              <p>
                Local Time:
                {d.localTime}
              </p>
            </div>
          ))}

          {/* SAVE BUTTON */}
          <button onClick={handleSave}>
            Save Trip
          </button>

        </div>
      )}

    </div>
  );
}