import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await signOut(auth);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userType");
      navigate("/login");
    };

    logout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
