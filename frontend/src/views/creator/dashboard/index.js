import React, { useEffect , useState} from "react";
import StatisticsCards from "../../../components/creator/statistics_cards";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css"; // (optional) If you are using marker clusters



const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '');
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);
  return (
    <>
     
      {/* <!-- Page Header--> */}
      <div className="mt-6 mx-4 p-6 rounded-sm bg-green-400 mb-6">
        {/* <!-- Content --> */}
        <div className="">
          <h1 className="text-slate-100 font-bold text-2xl">
          {greeting} , {user?.name || ''}. 👋
          </h1>
        </div>
      </div>

      {/* <!-- Statistics Cards --> */}
      <StatisticsCards />
                  
      {/* <!-- ./External resources --> */}
    </>
  );
};

export default Dashboard;
