import React, { useEffect, useState } from "react";
import supabase from "./data/supabase";

const Services = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [villageName, setVillageName] = useState("");
  const [issue, setIssue] = useState("");

  useEffect(() => {
    const fetchStates = async () => {
      const { data, error } = await supabase.from("DistrictTable").select("*");
      if (error) {
        console.log("Error fetching states:", error);
      } else {
        setStates(data);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedState) return;

      const stateWithSuffix = selectedState + "(State)";
      const { data, error } = await supabase
        .from("PDistrictsTable")
        .select("*")
        .eq("StateName", stateWithSuffix);

      if (error) {
        console.log("Error fetching districts:", error);
      } else {
        setDistricts(data);
        setSelectedDistrict("");
      }
    };

    fetchDistricts();
  }, [selectedState]);

const handleSubmit = async () => {
  console.log("State:", selectedState);
  console.log("District:", selectedDistrict);
  console.log("Village Name:", villageName);
  console.log("Issue:", issue);

  
  const { data, error } = await supabase
    .from("issues")
    .insert([
      {
        state: selectedState,
        district: selectedDistrict,
        village: villageName,
        issue: issue,
      },
    ]);

  if (error) {
    console.error("Error inserting data:", error);
    alert("Error submitting form. Check console.");
  } else {
    console.log("Data inserted:", data);
    setSelectedState("");
    setSelectedDistrict("");
    setVillageName("");
    setIssue("");
    alert("Form Submitted Successfully!");
  }
};

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Services Form</h1>

      {/* Country Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Country</label>
        <select
          disabled
          className="form-select block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700"
          value="India"
        >
          <option>India</option>
        </select>
      </div>

      {/* State Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">State</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="form-select block w-full px-3 py-2 border rounded-md bg-white text-gray-700 hover:border-blue-500"
        >
          <option value="" disabled>
            Select State
          </option>
          {states.map((state) => (
            <option key={state.id} value={state.StateName}>
              {state.StateName}
            </option>
          ))}
        </select>
      </div>

      {/* District Dropdown */}
      {selectedState && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">District</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="form-select block w-full px-3 py-2 border rounded-md bg-white text-gray-700 hover:border-blue-500"
          >
            <option value="" disabled>
              Select District
            </option>
            {districts.map((district) => (
              <option key={district.id} value={district.DistrictName}>
                {district.DistrictName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Village Input + Issue Box */}
      {selectedDistrict && (
        <>
          {/* Village Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 form-label">Village Name</label>
            <input
              type="text"
              value={villageName}
              onChange={(e) => setVillageName(e.target.value)}
              placeholder="Enter your Village Name"
              className=" form-control block w-full px-3 py-2 border rounded-md bg-white text-gray-700"
            />
          </div>

          {/* Issue Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 form-label">Issue</label>
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe your issue"
              className="form-control block w-full px-3 py-2 border rounded-md bg-white text-gray-700"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="btn btn-success px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default Services;
