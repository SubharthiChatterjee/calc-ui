import "./history.style.css";
import user from "../../assets/user.png";

const NoItem = () => {
  return <div className="item">No Result found</div>;
};

const Loading = () => {
  return <div className="item">Loading</div>;
};

const CalcHistory = ({ logs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="listContainer">
        <Loading />
      </div>
    );
  }
  return (
    <div className="listContainer">
      {logs?.length ? (
        logs.map((history, idx) => {
          return (
            <div className="item" key={history.id ?? idx}>
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
          );
        })
      ) : (
        <NoItem />
      )}
    </div>
  );
};

export default CalcHistory;
