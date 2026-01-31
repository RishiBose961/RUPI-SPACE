import Profile from "../Profile/Profile"
import MainHome from "./MainHome"

const Home = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
        <div>
            <Profile/>
        </div>
        <div  className=" lg:col-span-2">
            <MainHome/>
        </div>
    </div>
  )
}

export default Home