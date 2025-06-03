import React from "react";

interface UserInitialCircleProps {
    name: string;
}

const UserInitialCircle: React.FC<UserInitialCircleProps> = ({ name }) => {
    const initial = name?.charAt(0)?.toUpperCase() || "?";
    return (
        <span
            style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 20,
                color: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >
            {initial}
        </span>
    );
};

export default UserInitialCircle;
