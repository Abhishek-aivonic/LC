import React, { useEffect, useState } from "react";
import supabase from "./data/supabase";

const Services = () => {
  const [villageName, setVillageName] = useState([]);
  const [issue, setIssue] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [extraField, setExtraField] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [customDepartment, setCustomDepartment] = useState("");

  const fetchVillages = async () => {
    const { data, error } = await supabase.from("VillagesTable").select("*");
    if (error) {
      console.error("Error fetching villages:", error);
    } else {
      setVillageName(data);
    }
  };
  useEffect(() => {
    fetchVillages();
  }, []);

const handleSubmit = async () => {
  if (!selectedVillage) {
    alert("Please select a village before submitting.");
    return;
  }
  if (!issue.trim()) {
    alert("Please describe your issue before submitting.");
    return;
  }

  console.log("State: Andhra Pradesh");
  console.log("District: Visakhapatanam");
  console.log("Village Name:", selectedVillage);
  console.log("Issue:", issue);

  let uploadedImageUrl = null;
  try {
    if (imageFile) {
      const filePath = `complaints/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("complaints")
        .upload(filePath, imageFile, { upsert: false });
      if (uploadError) {
        console.error("Image upload failed:", uploadError);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("complaints")
          .getPublicUrl(filePath);
        uploadedImageUrl = publicUrlData?.publicUrl || null;
      }
    }
  } catch (e) {
    console.error("Unexpected error during image upload:", e);
  }

  const departmentToSave = department === "Other" && customDepartment ? customDepartment : department || null;

  const { error } = await supabase
    .from("issues")
    .insert([
      {
        state: "Andhra Pradesh",
        district: "Visakhapatanam",
        village: selectedVillage,
        issue: issue,
        phone: phoneNumber || null,
        address: address || null,
        department: departmentToSave,
        image_url: uploadedImageUrl,
      },
    ]);

  if (error) {
    console.error("Error inserting data:", error);
    alert("Error submitting form. Check console.");
  } else {
    setSelectedVillage("");
    setIssue("");
    setPhoneNumber("");
    setAddress("");
    setDepartment("");
    setCustomDepartment("");
    setImageFile(null);
    setExtraField(false);
    alert("Form Submitted Successfully!");
  }
};

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Services Form</h1>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Country</label>
        <select
          required
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
          required
          disabled
          value="Andhra Pradesh"
          className="form-select block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 hover:border-blue-500"
        >
          <option>Andhra Pradesh</option>
        </select>
      </div>

      {/* District Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">District</label>
          <select
            required
            disabled
            className="form-select block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 hover:border-blue-500"
          >
            <option>
              Visakhapatanam
            </option>
          </select>
        </div>

         <div className="mb-4">
          <label className="block text-gray-700 mb-2">Village</label>
          <select
            required
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="form-select block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 hover:border-blue-500"
          >
            <option value="">Select the Village</option>
            {villageName.map((village) => (
              <option key={village.id} value={village.VillageName}>
                {village.VillageName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 form-label">Issue</label>
          <textarea
            required
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="form-textarea form-control block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 hover:border-blue-500"
            rows="4"
            placeholder="Describe your issue here..."
          ></textarea>
        </div>

        <div className="mb-4 flex justify-end">
          {!extraField && (
            <button onClick={()=>setExtraField(true)} className="btn text-primary">(See More)</button>
          )}
          {extraField && (
            <button onClick={()=>setExtraField(false)} className="btn text-primary">(See less)</button>
          )}
        </div>

        {extraField && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-input block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 hover:border-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-textarea block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 hover:border-blue-500"
                rows="3"
                placeholder="Your address"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Complaint Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-select block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 hover:border-blue-500"
              >
                <option value="">Select department</option>
                <option value="Municipality">Municipality</option>
                <option value="Police">Police</option>
                <option value="Revenue">Revenue</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {department === "Other" && (
              <div>
                <label className="block text-gray-700 mb-2">Specify Department</label>
                <input
                  type="text"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  className="form-input block w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 hover:border-blue-500"
                  placeholder="Enter department name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                className="block w-full text-gray-700"
              />
            </div>
          </div>
        )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="btn btn-success px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedVillage || !issue.trim()}
          >
            Submit
          </button>
    </div>
  );
};

export default Services;
