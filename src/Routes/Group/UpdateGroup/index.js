import { useRef } from "react";
import { UpdateGrouptApi } from "../../../api"; // Assurez-vous que cette fonction existe dans vos APIs.
import { loading, User } from "../../../data";
import { useParams } from "react-router-dom";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    maxWidth: "400px",
    margin: "auto",
    position: "absolute",
    top: "30%",
    left: "50%",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
  },
};
export default function UpdateGroup() {
  const { id } = useParams();
  const [userData, setUserData] = User.useStore();
  const [loadingFlag, setLoadingFlag] = loading.useStore();
  const in1 = useRef();

  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        placeholder="Enter new name Of Service"
        ref={in1}
      />
      <button
        style={styles.button}
        onClick={() => {
          setLoadingFlag({ loading: true });
          UpdateGrouptApi(userData.token, id, in1.current.value).then(
            (response) => {
              setLoadingFlag({ loading: false });
              if (response[0]) {
                console.log("Error updating group:", response[0]);
                return;
              }
              console.log("group updated successfully");
            }
          );
        }}
      >
        Update
      </button>
    </div>
  );
}
