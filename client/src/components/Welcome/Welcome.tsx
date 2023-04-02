function Welcom(props: { onLogoutClicked: () => void }) {
  return (
    <>
      <h2>You are Welcome</h2>
      <></>
      <button onClick={props.onLogoutClicked}>Logout</button>
    </>
  );
}

export default Welcom;
