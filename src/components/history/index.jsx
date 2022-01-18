import user from "../../assets/user.png";
import "./history.style.css";

const NoItem = () => {
  return <div className="item">No Result found</div>;
};

const Loading = () => {
  return <div className="item">Loading</div>;
};

export const CalcHistory = ({ logs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="listContainer">
        <Loading />
      </div>
    );
  }

  const List = ({ logs }) => {
    const items = logs.map((history, idx) => (
      <div className="item" key={history.id}>
        <div className="flexRow" style={{ padding: ".5em 0" }}>
          <img
            src={user}
            alt="user"
            style={{ width: "25px", height: "25px" }}
          />
          <div className="userName">{history.user}</div>
          {/* <div>{history.timestamp}</div> */}
        </div>
        <div className="flexRow info">
          <div>{history.expression}</div>
          <div>=</div>
          <div>{history.result}</div>
        </div>
      </div>
    ));
    return items;
  };

  return (
    <div className="listContainer">
      {logs?.length ? <List logs={logs} /> : <NoItem />}
    </div>
  );
};
