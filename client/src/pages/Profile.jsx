import { useState, useEffect } from "react";
import { uploadProfileImage, getProfile } from "../api/authApi";

const Profile = () => {
  const [profileImage, setProfileImage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfileImage(res.data.user.profileImage);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Select image");

    const formData = new FormData();
    formData.append("image", file);

    const res = await uploadProfileImage(formData);
    setProfileImage(res.data.user.profileImage);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "380px",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "25px", fontWeight: "600" }}>Profile</h2>

        {/* Profile Image Centered */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "25px",
          }}
        >
          <img
            src={
              profileImage ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="profile"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #ddd",
            }}
          />
        </div>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "15px" }}
        />

        <button
          onClick={handleUpload}
          style={{
            width: "100%",
            padding: "12px",
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default Profile;
