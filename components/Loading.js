import { SpinnerInfinity } from "spinners-react";

function Loading() {
  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/whatsapplogo.png"
          alt=""
          style={{ marginBottom: 20 }}
          height={200}
        />
        <SpinnerInfinity
          size={75}
          thickness={100}
          speed={100}
          color="#36ad47"
          secondaryColor="rgba(0, 0, 0, 0.1)"
        />
      </div>
    </div>
  );
}
export default Loading;
